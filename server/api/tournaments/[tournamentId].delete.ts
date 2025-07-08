import { eq, and } from 'drizzle-orm'
import * as z from 'zod/v4'

import { hasTournamentDeletePermissions } from '~~/server/utils/drizzle/utils'

const pathParams = z.object({
	tournamentId: z.string().min(1),
})

/**
 * DELETE /tournments/[tournamentId]
 *
 * Deletes a tournament
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = event.context.auth.user!
		const { tournamentId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
		const deletedTournament = await db.delete(tournament)
			.where(
				and(
					eq(tournament.shortId, tournamentId),
					hasTournamentDeletePermissions(user),
				),
			)
			.returning({ shortId: tournament.shortId })
			.then(maybeSingle)

		if (!deletedTournament) {
			throw createNotFoundError('Tournament')
		}

		// theoretical we can return here and execute the deletion in the background
		sendNoContent(event)

		// fire and forget image deletion
		void deleteTournamentImages(event, deletedTournament.shortId)
	}),
})
