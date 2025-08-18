import { and, eq } from 'drizzle-orm';
import * as z from 'zod/v4';

const PathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
});

/**
 * DELETE /api/tournaments/[tournamentId]/teams/[teamId]
 *
 * Deletes a team in the tournament
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);

		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));

		// TODO: Fix Filter
		await db.delete(teamTable)
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					eq(teamTable.shortId, teamId),
					hasTournamentModifyPermissions(user),
				),
			);

		sendNoContent(event);

		// delete team image
		void deleteTeamImage(event, tournamentId, teamId);
	}),
});
