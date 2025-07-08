import * as z from 'zod/v4'

import { hasTournamentViewPermissions, maybeSingle } from '~~/server/utils/drizzle/utils'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { getSignedTournamentImage } from '~~/server/utils/supabase/images'

const pathParams = z.object({
	tournamentId: z.string().min(1),
})

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = event.context.auth.user
		const { tournamentId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))

		const { shortId, createdAt, ...rest } = getTableColumns(tournament)
		const selectedTournament = await db.select({
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

		if (!selectedTournament) {
			throw createNotFoundError('Tournament')
		}

		const imageUrl = await getSignedTournamentImage(event, selectedTournament.tournamentId)

		return {
			imageUrl,
			...selectedTournament,
		}
	}),
})
