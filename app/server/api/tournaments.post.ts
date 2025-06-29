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

		const body = await readValidatedBody(event, data => requestBody.parse(data))

		const insertedTournament = await db.transaction(async (tx) => {
			const { shortId, createdAt, ...rest } = getTableColumns(tournament)

			const insertedTournament = await tx.insert(tournament)
				.values({
					name: body.name,
					isPrivate: body.isPrivate,
					ownerId: user.id,
				})
				.returning({ ...rest, id: tournament.shortId })
				.then(single)

			const result: Simplify<typeof insertedTournament & { imageUrl?: string }> = insertedTournament

			if (body.imageId) {
				result.imageUrl = (await moveTournamentImage(event, body.imageId, insertedTournament.id)).signedUrl
			}

			return result
		})

		return insertedTournament
	},
})

type Simplify<T> = { [K in keyof T]: T[K] } & {}
