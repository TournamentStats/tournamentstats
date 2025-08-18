import * as z from 'zod/v4';

import { and, eq, sql, notExists, inArray } from 'drizzle-orm';

import type { Simplify } from 'type-fest';

import { docs } from '@server/docs/tournaments/[tournamentId]/teams/[teamId]/players.patch.docs';

const PathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
});

const Puuid = z.string().length(78, 'No valid puuid');

const Player = z.object({
	puuid: Puuid,
	name: z.string().min(2).max(24).optional(),
});

const RequestBody = z.object({
	add: z.array(Player).optional(),
	remove: z.array(Puuid).optional(),
}).refine(data => data.add?.length ?? data.remove?.length, {
	message: 'At least one of \'add\' or \'remove\' must be provided and non-empty',
	path: ['add', 'remove'],
});

defineRouteMeta({
	openAPI: docs,
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);
		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { add, remove } = await readValidatedBody(event, data => RequestBody.parse(data));

		// check permissions, get information about tournament/team
		// region needed for fetching players
		// ids needed for deleting
		const context = await db.select({
			tournamentId: tournamentTable.tournamentId,
			teamId: teamTable.teamId,
			region: tournamentTable.region,
		})
			.from(tournamentTable)
			.innerJoin(teamTable, eq(teamTable.tournamentId, tournamentTable.tournamentId))
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					eq(teamTable.shortId, teamId),
					hasTournamentModifyPermissions(user),
				),
			)
			.then(maybeSingle);

		if (!context) {
			throw createNotFoundError('Team');
		}

		const puuids = [...(add?.map(p => p.puuid) ?? []), ...(remove ?? [])];

		// check if there a puuids not in our database
		const missingPuuids = await db.select({
			puuid: sql<string>`puuid`.as('puuid'),
		})
			.from(sql`unnest(${puuids}) AS needed_puuids(puuid)`)
			.where(
				notExists(
					db.select({
						_: sql<number>`1`,
					})
						.from(playerTable)
						.where(
							eq(playerTable.puuid, sql`needed_puuids.puuid`),
						),
				),
			);

		// await all player fetches.
		await Promise.all(
			missingPuuids.map(
				async (missingPlayer) => {
					const { account, summoner } = await fetchPlayer(missingPlayer.puuid, context.region);
					await insertPlayer(account, summoner, context.region);
				},
			),
		);

		const { added, removed } = await db.transaction(async (tx) => {
			let added;
			if (add && add.length > 0) {
				// cte with placeholders and batch insert
				const insertedPlayerCTE = tx.$with('inserted_player').as(
					tx.insert(tournamentParticipantTable)
						.values({
							tournamentId: sql.placeholder('tournamentId'),
							teamId: sql.placeholder('teamId'),
							puuid: sql.placeholder('puuid'),
							name: sql.placeholder('name'),
						})
						.returning(),
				);

				// use cte to get short ids from the inserted players
				// in theory this is useless because its the same for all?
				const prepared = db.with(insertedPlayerCTE)
					.select({
						puuid: insertedPlayerCTE.puuid,
						name: insertedPlayerCTE.name,
						gameName: playerTable.gameName,
						tagLine: playerTable.tagLine,
					})
					.from(insertedPlayerCTE)
					.innerJoin(playerTable, eq(playerTable.puuid, insertedPlayerCTE.puuid))
					.prepare('insert_player');

				added = await Promise.all(add.map(async (player) => {
					const insertedPlayer = await prepared.execute({
						...player,
						tournamentId: context.tournamentId,
						teamId: context.teamId,
					})
						.then(single);
					return insertedPlayer;
				}));
			}
			let removed;
			if (remove && remove.length > 0) {
				// work around with `using` to get player information in a single query

				type Selected = Simplify<
					Pick<typeof tournamentParticipantTable.$inferSelect, 'puuid' | 'name'>
					& Pick<typeof playerTable.$inferInsert, 'gameName' | 'tagLine'>
				>;

				const removedParticipants = await db.execute<Selected>(sql`
					DELETE FROM ${tournamentParticipantTable}
					USING ${playerTable}
					WHERE ${and(
						eq(tournamentParticipantTable.puuid, tournamentParticipantTable.puuid),
						eq(tournamentParticipantTable.tournamentId, context.tournamentId),
						eq(tournamentParticipantTable.teamId, context.teamId),
						inArray(tournamentParticipantTable.puuid, remove),
					)}
					RETURNING ${tournamentParticipantTable.puuid}, ${tournamentParticipantTable.name}, ${playerTable.gameName}, ${playerTable.tagLine}
					`);

				removed = Array.from(removedParticipants);
			}
			return { added, removed };
		});
		return { added, removed };
	}),
});
