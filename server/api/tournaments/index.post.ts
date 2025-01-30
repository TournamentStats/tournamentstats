import { z } from 'zod'

import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

const requestBody = z.object({
	name: z.string().min(3).max(32),
	is_private: z.boolean(),
	image_id: z.string().optional(),
})

/**
 * POST /api/tournaments
 *
 * Creates an tournament
 *
 * RequestBody: information about the tournament
 * 	name: string
 * 	isPrivate: string
 * 	imageId?: string
 *
 * Returns: Information about the created tournament
 * 	tournament_id: string
 * 	owner_id: string (uuid)
 * 	name: string
 * 	is_private : boolean
 * 	start_date: string (iso date)
 * 	end_date: string (iso date)
 * 	image_url: string (url)
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

		const { name, is_private: isPrivate, image_id: imageId } = await readValidatedBody(event, data => requestBody.parse(data))

		const client = serverSupabaseServiceRole(event)

		const createTournamentResponse = await client.from('tournament')
			.insert({ name: name, owner_id: user.id, is_private: isPrivate })
			.select(
				'short_id, owner_id, name, is_private, start_date, end_date',
			)
			.single()

		if (createTournamentResponse.error) {
			event.context.errors.push(createTournamentResponse.error)
			handleError(createTournamentResponse)
		}

		const tournamentShortId = createTournamentResponse.data.short_id

		let imageUrl: string | undefined

		// try to move the image if imageId is provived, rollback if imageId is not found or something unexpected happens
		if (imageId) {
			// maybe here should we use the authenticated client?
			const moveImageResponse = await client.storage.from('tournament-images')
				.move(`uploads/${imageId}.png`, `${tournamentShortId}/tournament.png`)

			if (moveImageResponse.error) {
				event.context.errors.push(moveImageResponse.error)

				await client.from('tournament')
					.delete()
					.eq('short_id', tournamentShortId)

				if (moveImageResponse.error.name == 'NoSuchKey') {
					throw createError({
						statusCode: 404,
						statusMessage: 'Not Found',
						message: 'Image id not found. Only use ids from image uploads. Upload image and try again.',
					})
				}

				throw createError({
					statusCode: 500,
					statusMessage: 'Internal Server Error',
					message: 'Something unexpected happened.',
				})
			}

			const signedUrlResponse = await client.storage.from('tournament-images')
				.createSignedUrl(
					`${tournamentShortId}/tournament.png`,
					60 * 60 * 24,
				)

			if (signedUrlResponse.error) {
				event.context.errors.push(signedUrlResponse.error)

				await client.from('tournament')
					.delete()
					.eq('short_id', tournamentShortId)

				throw createError({
					statusCode: 500,
					statusMessage: 'Internal Server Error',
					message: 'Something unexpected happened.',
				})
			}
			imageUrl = signedUrlResponse.data.signedUrl
		}

		setResponseStatus(event, 201, 'Created')
		return { ...createTournamentResponse.data, image_url: imageUrl }
	},
})
