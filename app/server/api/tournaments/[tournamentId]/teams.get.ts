import { and, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

const pathParams = z.object({
	tournamentId: z.string().min(1),
})

/**
 * GET tournaments/[tournamentId]/teams
 *
 * Gets all teams in the tournament
 *
 * ResponseBody: team[]
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user
		const { tournamentId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
		const { shortId, createdAt, ...rest } = getTableColumns(team)
		let selectedTeams
		try {
			selectedTeams = await db.select({
				...rest,
				teamId: team.shortId,
				tournamentId: tournament.shortId,
			})
				.from(team)
				.innerJoin(tournament, eq(team.tournamentId, tournament.tournamentId))
				.where(
					and(
						eq(tournament.shortId, tournamentId),
						hasTournamentViewPermissions(user),
					),
				)
		}
		catch (e: unknown) {
			if (e instanceof Error) {
				event.context.errors.push(e)
			}
			throw createGenericError()
		}
		return selectedTeams
	},
})
