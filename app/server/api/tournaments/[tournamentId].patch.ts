import { and, eq, getTableColumns } from 'drizzle-orm'
import * as z from 'zod/v4'

import { hasTournamentModifyPermissions, maybeSingle } from '@utils/drizzle/utils'

const pathParams = z.object({
	tournamentId: z.string().min(1),
})

const requestBody = z.object({
	name: z.string().min(3).max(32).optional(),
	isPrivate: z.boolean().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	imageId: z.string().optional(),
})

/**
 * PATCH /tournaments/[tournamentId]
 *
 * Patches a tournament
 *
 * ResponseBody: tournament
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
		const { name, isPrivate, startDate, endDate, imageId } = await readValidatedBody(event, obj => requestBody.parse(obj))

		const { shortId, createdAt, ...rest } = getTableColumns(tournament)
		const updatedTournament = await db.transaction(async (tx) => {
			let updatedTournament
			try {
				updatedTournament = await tx.update(tournament)
					.set({
						name,
						isPrivate,
						startDate: startDate?.toUTCString(),
						endDate: endDate?.toUTCString(),
					})
					.where(
						and(
							eq(tournament.shortId, tournamentId),
							hasTournamentModifyPermissions(user),
						),
					)
					.returning({
						...rest,
						tournamentId: tournament.shortId,
					})
					.then(maybeSingle)
			}
			catch (e: unknown) {
				if (e instanceof Error) {
					event.context.errors.push(e)
				}
				throw createGenericError()
			}

			if (!updatedTournament) {
				throw createNotFoundError('Tournament')
			}

			let imageUrl = null
			if (imageId) {
				imageUrl = (await moveTournamentImage(event, imageId, updatedTournament.tournamentId)).signedUrl
			}

			return {
				imageUrl,
				...updatedTournament,
			}
		})
		return updatedTournament
	},
})
