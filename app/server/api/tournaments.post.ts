import { z } from 'zod'
import { getTableColumns } from 'drizzle-orm'
import { single } from '@utils/drizzle/utils'

const requestBody = z.object({
	name: z.string().min(3).max(32),
	isPrivate: z.boolean(),
	imageId: z.string().optional(),
})

/**
 * POST /api/tournaments
 *
 * Creates a tournament
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

		const { name, isPrivate, imageId } = await readValidatedBody(event, data => requestBody.parse(data))

		const insertedTournament = await db.transaction(async (tx) => {
			const { shortId, createdAt, ...rest } = getTableColumns(tournament)

			let insertedTournament
			try {
				insertedTournament = await tx.insert(tournament)
					.values({
						name,
						isPrivate,
						ownerId: user.id,
					})
					.returning({ ...rest, id: tournament.shortId })
					.then(single)
			}
			catch (e: unknown) {
				if (e instanceof Error) {
					event.context.errors.push(e)
				}
				throw createGenericError()
			}

			let imageUrl = null
			if (imageId) {
				imageUrl = (await moveTournamentImage(event, imageId, insertedTournament.id)).signedUrl
			}

			return {
				imageUrl,
				...insertedTournament,
			}
		})

		return insertedTournament
	},
})
