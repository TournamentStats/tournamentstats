import * as z from 'zod/v4';

import { and, eq, sql, notExists, inArray } from 'drizzle-orm';

import type { Simplify } from 'type-fest';

import { docs } from '@server/docs/tournaments/[tournamentId]/teams/[teamId]/players.patch.docs';
import { RiotError, type LolRegion } from 'riotapi-fetch-typed';

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
			tournamentId: tournament.tournamentId,
			teamId: team.teamId,
			region: tournament.region,
		})
			.from(tournament)
			.innerJoin(team, eq(team.tournamentId, tournament.tournamentId))
			.where(
				and(
					eq(tournament.shortId, tournamentId),
					eq(team.shortId, teamId),
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
						1: sql<number>`1`,
					})
						.from(player)
						.where(
							eq(player.puuid, sql`needed_puuids.puuid`),
						),
				),
			);

		// await all player fetches.
		await Promise.all(
			missingPuuids.map(
				missingPlayer => fetchPlayer(missingPlayer.puuid, context.region),
			),
		);

		const { added, removed } = await db.transaction(async (tx) => {
			let added;
			if (add && add.length > 0) {
				// cte with placeholders and batch insert
				const insertedPlayerCTE = tx.$with('inserted_player').as(
					tx.insert(tournamentParticipant)
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
						gameName: player.gameName,
						tagLine: player.tagLine,
					})
					.from(insertedPlayerCTE)
					.innerJoin(player, eq(player.puuid, insertedPlayerCTE.puuid))
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
					Pick<typeof tournamentParticipant.$inferSelect, 'puuid' | 'name'>
					& Pick<typeof player.$inferInsert, 'gameName' | 'tagLine'>
				>;

				const removedParticipants = await db.execute<Selected>(sql`DELETE FROM ${tournamentParticipant}
					USING ${player}
					WHERE ${and(
						eq(tournamentParticipant.puuid, tournamentParticipant.puuid),
						eq(tournamentParticipant.tournamentId, context.tournamentId),
						eq(tournamentParticipant.teamId, context.teamId),
						inArray(tournamentParticipant.puuid, remove),
					)}
					RETURNING ${tournamentParticipant.puuid}, ${tournamentParticipant.name}, ${player.gameName}, ${player.tagLine}
					`);

				removed = Array.from(removedParticipants);
			}
			return { added, removed };
		});
		return { added, removed };
	}),
});

async function fetchPlayer(puuid: string, region: LolRegion) {
	let account;
	try {
		account = (await riotFetch(`/riot/account/v1/accounts/by-puuid/${puuid}`, {
			region: regionToCluster(region),
		})).data;
	}
	catch (e: unknown) {
		if (e instanceof RiotError) {
			if (e.statusCode === 404) {
				throw createNotFoundError('PUUID');
			}
		}
		throw e;
	}

	let summoner;
	try {
		summoner = (await riotFetch(`/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
			region,
		})).data;
	}
	catch (e: unknown) {
		if (e instanceof RiotError) {
			if (e.statusCode === 404) {
				throw createNotFoundError('Summoner');
			}
		}
		throw e;
	}

	await db.insert(player)
		.values({
			puuid: account.puuid,
			gameName: account.gameName,
			tagLine: account.tagLine,
			region: region,
			profileIconId: summoner.profileIconId,
		})
		.onConflictDoUpdate({
			target: player.puuid,
			set: {
				puuid: account.puuid,
				gameName: account.gameName,
				tagLine: account.tagLine,
				region: region,
				profileIconId: summoner.profileIconId,
			},
		});
}
