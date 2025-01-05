import { z } from 'zod'

import type { User } from '@supabase/supabase-js'

import { serverSupabaseServiceRole } from '#supabase/server'
import logger, { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

const requestBody = z.object({
	name: z.string().min(3).max(32),
	isPrivate: z.boolean(),
	imageId: z.string(), // empty string to delete image
})

export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user as User

		const tournamentId = getRouterParam(event, 'tournamentId')
		const { name, isPrivate, imageId } = await readValidatedBody(event, requestBody.parse)
		const imagePath = imageId ? `${imageId}.png` : null

		// check if tournament exists and user is permitted to edit it
		const client = await serverSupabaseServiceRole(event)
		const response = await client.from('tournament')
			.select('tournament_id, owner_id, image_path')
			.eq('short_id', tournamentId)
			.single()

		handleError(user, response)
		const { data: currentData } = response

		// check if tournament exists
		if (!currentData) {
			return createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: `Tournament <${tournamentId}> not found`,
			})
		}

		if (currentData.owner_id != user.id) {
			return createError({
				status: 403,
				statusMessage: 'Forbidden',
				message: 'You are not authorized to edit this tournament.',
			})
		}

		// if image id is given, check if user is authenticated to use it
		if (imagePath) {
			const response = await client.schema('storage').from('objects')
				.select('id')
				.eq('name', imagePath)
				.eq('owner_id', user.id)

			handleError(user, response)
			if (response.data.length == 0) {
				return createError({
					statusCode: 404,
					statusMessage: 'Not Found',
					message: `Image with id ${imageId} not found.`,
				})
			}
		}

		// delete old file if it exists and is different from new file
		if (currentData.image_path && currentData.image_path != imagePath) {
			const { data, error } = await client.storage.from('tournament-images').remove(data.image_path)
			if (error) {
				logger.error(`Error during deleting old file. Path: ${data.image_path}.\n${JSON.stringify(error, null, 4)}`)
				return createError({
					statusCode: 500,
					statusMessage: 'Internal Server Error',
					message: 'Something unexpected happened.',
				})
			}
		}

		const updateResponse = await client.from('tournament')
			.update({
				name: name,
				is_private: isPrivate,
				image_path: imagePath,
			})
			.eq('tournament_id', currentData.id)
			.select('short_id, owner_id, name, is_private, start_date, end_date, image_path')
			.single()

		handleError(user, updateResponse)

		if (!updateResponse.data) {
			logger.error(`Unexpected empty result when updating:\n${JSON.stringify(user, null, 4)}\nshort_id=${tournamentId}\npath=${imagePath}`)
			return createError({
				statusCode: 500,
				statusMessage: 'Internal Server Error',
				message: 'Something unexpected happened.',
			})
		}

		return updateResponse.data
	},
})
