import { z } from 'zod/v4';

import { eq, and } from 'drizzle-orm';

const PathParams = z.object({
	tournamentId: z.string().min(1),
});

const RequestBody = z.object({
	team1Id: z.string(),
	team2Id: z.string(),
	format: z.enum(formats),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { team1Id, team2Id, format } = await readValidatedBody(event, obj => RequestBody.parse(obj));

		const context = await db.select({
			tournamentId: tournament.tournamentId,
		})
			.from(tournament)
			.where(
				and(
					eq(tournament.shortId, tournamentId),
					hasTournamentModifyPermissions(user),
				),
			)
			.then(maybeSingle);

		if (!context) {
			throw createNotFoundError('Tournament');
		}
		const insertedMatchupCTE = db.$with('inserted_matchup').as(
			db.insert(matchup)
				.values({ team1Id: 1, team2Id: 1, tournamentId: 1, format: format })
				.returning(),
		);
	}),
});
