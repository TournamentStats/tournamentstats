import { z } from 'zod/v4';

import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const PathParams = z.object({
	tournamentId: z.string().min(1),
});

const RequestBody = z.object({
	team1Id: z.string(),
	team2Id: z.string(),
	format: z.enum(formats),
});

const team1 = alias(teamTable, 'team1');
const team2 = alias(teamTable, 'team2');

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { team1Id, team2Id, format } = await readValidatedBody(event, obj => RequestBody.parse(obj));

		const context = await db.select({
			tournamentId: tournamentTable.tournamentId,
			team1Id: team1.teamId,
			team2Id: team2.teamId,
		})
			.from(tournamentTable)
			.leftJoin(team1, eq(team1.shortId, team1Id))
			.leftJoin(team2, eq(team2.shortId, team2Id))
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					hasTournamentModifyPermissions(user),
				),
			)
			.then(maybeSingle);

		if (!context) {
			throw createNotFoundError('Tournament');
		}

		if (context.team1Id == null || context.team2Id == null) {
			const fields = [];

			if (context.team1Id == null) {
				fields.push('team1Id');
			}

			if (context.team2Id == null) {
				fields.push('team2Id');
			}

			throw createNotFoundError('Team', { fields });
		}

		const insertedMatchupCTE = db.$with('inserted_matchup').as(
			db.insert(matchupTable)
				.values({
					tournamentId: context.tournamentId,
					team1Id: context.team1Id,
					team2Id: context.team2Id,
					format,
				})
				.returning(),
		);

		const insertedMatchup = await db.with(insertedMatchupCTE)
			.select({
				matchupId: insertedMatchupCTE.shortId,
				tournamentId: tournamentTable.shortId,
				team1Id: team1.shortId,
				team2Id: team2.shortId,
			})
			.from(insertedMatchupCTE)
			.innerJoin(tournamentTable, eq(tournamentTable.tournamentId, insertedMatchupCTE.tournamentId))
			.innerJoin(team1, eq(team1.teamId, insertedMatchupCTE.team1Id))
			.innerJoin(team2, eq(team2.teamId, insertedMatchupCTE.team2Id))
			.then(single);

		return insertedMatchup;
	}),
});
