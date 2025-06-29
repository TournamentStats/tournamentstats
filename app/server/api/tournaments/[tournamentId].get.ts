import { z } from 'zod'
import { hasTournamentViewPermissions, maybeSingle } from '@utils/drizzle/utils'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { getSignedTournamentImage } from '@utils/supabase/images'

const pathParams = z.object({
	tournamentId: z.string().min(1),
})
/**
 * GET tournaments/[tournamentId]
 *
 * Gets a tournament
 *
 * ResponseBody: tournament
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user
		const { tournamentId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))

		const { shortId, createdAt, ...rest } = getTableColumns(tournament)
		let selectedTournament
		try {
			selectedTournament = await db.select({
				...rest,
				tournamentId: tournament.shortId,
			})
				.from(tournament)
				.where(
					and(
						eq(tournament.shortId, tournamentId),
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

		if (!selectedTournament) {
			throw createNotFoundError('Tournament')
		}

		const imageUrl = await getSignedTournamentImage(event, selectedTournament.tournamentId)

		return {
			...selectedTournament,
			imageUrl,
		}
	},
})
