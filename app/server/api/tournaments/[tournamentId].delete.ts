import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { hasTournamentDeletePermissions } from '@utils/drizzle/utils'

const pathParams = z.object({
	tournamentId: z.string().min(1),
})

/**
 * DELETE /tournments/[tournamentId]
 *
 * Deletes a tournament
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
		const { tournamentId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
		try {
			await db.delete(tournament)
				.where(
					and(
						eq(tournament.shortId, tournamentId),
						hasTournamentDeletePermissions(user),
					),
				)
		}
		catch (e: unknown) {
			if (e instanceof Error) {
				event.context.errors.push(e)
			}
			throw createGenericError()
		}

		// theoretical we can return here and execute the deletion in the background
		sendNoContent(event)

		// fire and forget image deletion
		void deleteTournamentImages(event, tournamentId)
	},
})
