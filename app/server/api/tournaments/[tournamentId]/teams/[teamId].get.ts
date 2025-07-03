import { and, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

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
	handler: async (event) => {
		const user = event.context.auth.user

		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
		const { shortId, createdAt, ...rest } = getTableColumns(team)
		let selectedTeam
		try {
			selectedTeam = await db.select({
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
		}
		catch (e: unknown) {
			if (e instanceof Error) {
				event.context.errors.push(e)
			}
			throw createGenericError()
		}

		if (!selectedTeam) {
			throw createNotFoundError('Team')
		}

		const imageUrl = await getSignedTeamImage(event, selectedTeam.tournamentId, selectedTeam.teamId)

		return {
			imageUrl,
			...selectedTeam,
		}
	},
})
