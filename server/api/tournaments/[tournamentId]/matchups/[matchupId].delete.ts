import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod/v4';

const PathParams = z.object({
	tournamentId: z.string().min(1),
	matchupId: z.string().min(1),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);
		const { tournamentId, matchupId } = await getValidatedRouterParams(
			event,
			obj => PathParams.parse(obj),
		);

		const deletedMatchup = await db.execute<{ matchupId: number }>(sql`
			DELETE FROM ${matchupTable}
			USING ${tournamentTable}
			WHERE ${and(
				eq(matchupTable.tournamentId, tournamentTable.tournamentId),
				eq(tournamentTable.shortId, tournamentId),
				eq(matchupTable.shortId, matchupId),
				hasTournamentDeletePermissions(user),
			)}
			RETURNING ${matchupTable.matchupId}
			`)
			.then(maybeSingle);

		if (!deletedMatchup) {
			throw createNotFoundError('Matchup');
		}

		sendNoContent(event);
	}),
});
