import * as z from 'zod/v4'

import { getTableColumns } from 'drizzle-orm'
import { single } from '~~/server/utils/drizzle/utils'

const requestBody = z.object({
	name: z.string().min(3).max(32),
	isPrivate: z.boolean(),
	imageId: z.string().optional(),
	region: z.enum(regions),
})

/**
 * POST /api/tournaments
 *
 * Creates a tournament
 *
 * ResponseBody: tournament
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = event.context.auth.user!

		const { name, isPrivate, imageId, region } = await readValidatedBody(event, data => requestBody.parse(data))

		const insertedTournament = await db.transaction(async (tx) => {
			const { shortId, createdAt, ...rest } = getTableColumns(tournament)

			const insertedTournament = await tx.insert(tournament)
				.values({
					name,
					isPrivate,
					ownerId: user.id,
					region,
				})
				.returning({ ...rest, id: tournament.shortId })
				.then(single)

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
	}),
})
