import { randomBytes } from 'crypto'
import sharp from 'sharp'
import { serverSupabaseClient } from '#supabase/server'
import logger, { logAPI } from '~/server/utils/logging'
import { image_ids } from '~/server/utils/sqids'

import { authentication } from '~/server/utils/middleware'

/**
 * Send image with body (image/png), file goes in here
 * use with supabase client i guess
 *
 * Uploads an image to the tournament-images bucket with a random id
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const contentType = await getHeader(event, 'Content-Type')

		if (contentType != 'image/png') {
			return createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Content Type not png',
			})
		}

		const buffer = await readRawBody(event, false)

		if (!buffer) {
			return createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No image data',
			})
		}

		// we use sharp to validate that our buffer is an actual image and to strip metadata
		const img = sharp(buffer)

		// sharp allows conversion to png but for simplicity we just allow png for now
		if ((await img.metadata()).format != 'png') {
			return createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				mesage: 'Image format not png',
			})
		}

		// const client = await serverSupabaseServiceRole(event)
		const client = await serverSupabaseClient(event)

		// generate random id for image
		const imageId = image_ids.encode(randomBytes(6))

		const uploadImageResponse = await client.storage.from('tournament-images')
			.upload(
				`uploads/${imageId}.png`, await img.toBuffer(),
				{
					contentType: 'image/png',
				},
			)

		if (uploadImageResponse.error) {
			event.context.errors.push(uploadImageResponse.error)
			return createError({
				statusCode: 500,
				statusMessage: 'Internal Server error',
				message: 'Something unexpected happened',
			})
		}

		const data = uploadImageResponse.data

		logger.info(`Uploaded Image to ${data.fullPath} with id ${data.id}`, { section: 'Storage' })

		setResponseStatus(event, 201, 'Created')
		return { image_id: imageId }
	},
})
