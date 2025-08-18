import { and, eq, getTableColumns } from 'drizzle-orm';
import * as z from 'zod/v4';
import { teamTable, tournamentTable } from '../../../../utils/drizzle/db/schema';

const PathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
});

/**
 * GET /api/tournaments/[tournamentId]/teams/[teamId]
 *
 * Gets a team in a the tournament
 *
 * Returns: team
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = event.context.auth.user;

		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { shortId, createdAt, ...rest } = getTableColumns(teamTable);
		const selectedTeam = await db.select({
			...rest,
			teamId: teamTable.shortId,
			tournamentId: tournamentTable.shortId,
		})
			.from(teamTable)
			.innerJoin(tournamentTable, eq(teamTable.tournamentId, tournamentTable.tournamentId))
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					eq(teamTable.shortId, teamId),
					hasTournamentViewPermissions(user),
				),
			)
			.then(maybeSingle);

		if (!selectedTeam) {
			throw createNotFoundError('Team');
		}

		const imageUrl = await getSignedTeamImage(event, selectedTeam.tournamentId, selectedTeam.teamId);

		return {
			...selectedTeam,
			imageUrl,
		};
	}),
});
