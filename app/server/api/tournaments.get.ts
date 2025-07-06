import { getTableColumns } from 'drizzle-orm'
import { getSignedTournamentImage } from '@utils/supabase/images'

defineRouteMeta({
	openAPI: {
		tags: ['tournament'],
		description: 'Gets all Tournaments the authenticated user can see, that means public tournaments and tournaments the user is invited to.',
		security: [{ authentication: [] }],
	},
})

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

		// remove shortId and createdAt from result
		// assign tournamentId our short id alias
		const { shortId, createdAt, ...rest } = getTableColumns(tournament)
		let selectedTournaments
		try {
			selectedTournaments = await db.select({
				...rest,
				tournamentId: tournament.shortId,
			})
				.from(tournament)
				.where(
					hasTournamentViewPermissions(user),
				)
		}
		catch (e: unknown) {
			if (e instanceof Error) {
				event.context.errors.push(e)
			}
			throw createGenericError()
		}

		const tournamentsWithImages = await Promise.all(
			selectedTournaments.map(async t => ({
				imageUrl: await getSignedTournamentImage(event, t.tournamentId),
				...t,
			})),
		)

		return tournamentsWithImages
	},
})
