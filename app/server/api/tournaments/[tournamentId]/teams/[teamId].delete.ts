import { and, eq } from 'drizzle-orm'
import * as z from 'zod/v4'

const pathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
})

/**
 * DELETE /api/tournaments/[tournamentId]/teams/[teamId]
 *
 * Deletes a team in the tournament
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user!

		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))

		try {
			await db.delete(team)
				.where(
					and(
						eq(tournament.shortId, tournamentId),
						eq(team.shortId, teamId),
						hasTournamentModifyPermissions(user),
					),
				)
		}
		catch (e: unknown) {
			if (e instanceof Error) {
				event.context.errors.push(e)
			}
			throw createGenericError()
		}

		sendNoContent(event)

		// delete team image
		void deleteTeamImage(event, tournamentId, teamId)
	},
})
