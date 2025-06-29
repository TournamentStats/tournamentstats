import { eq, getTableColumns, or } from 'drizzle-orm'
import { isOwner } from '@utils/drizzle/utils'
import { getSignedTournamentImage } from '@utils/supabase/images'

/**
 * GET /api/tournaments
 *
 * Gets all tournaments the authenticated user can see
 *
 * ResponseBody: tournament[]
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user

		const filters = [
			eq(tournament.isPrivate, false),
		]

		if (user) {
			filters.push(isOwner(user))
		}

		// remove shortId and createdAt from result
		// assign tournamentId our short id alias
		const { shortId, createdAt, ...rest } = getTableColumns(tournament)

		const tournaments = await db.select({
			...rest,
			tournamentId: tournament.shortId,
		})
			.from(tournament)
			.where(
				or(...filters),
			)

		const tournamentsWithImages = await Promise.all(
			tournaments.map(async t => ({
				...t, imageUrl: await getSignedTournamentImage(event, t.tournamentId),
			})),
		)

		return tournamentsWithImages
	},
})
