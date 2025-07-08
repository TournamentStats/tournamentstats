import { and, eq, getTableColumns } from 'drizzle-orm'
import * as z from 'zod/v4'

const pathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
})

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
		const user = event.context.auth.user

		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
		const { shortId, createdAt, ...rest } = getTableColumns(team)
		const selectedTeam = await db.select({
			...rest,
			teamId: team.shortId,
			tournamentId: tournament.shortId,
		})
			.from(team)
			.innerJoin(tournament, eq(team.tournamentId, tournament.tournamentId))
			.where(
				and(
					eq(tournament.shortId, tournamentId),
					eq(team.shortId, teamId),
					hasTournamentViewPermissions(user),
				),
			)
			.then(maybeSingle)

		if (!selectedTeam) {
			throw createNotFoundError('Team')
		}

		const imageUrl = await getSignedTeamImage(event, selectedTeam.tournamentId, selectedTeam.teamId)

		return {
			imageUrl,
			...selectedTeam,
		}
	}),
})
