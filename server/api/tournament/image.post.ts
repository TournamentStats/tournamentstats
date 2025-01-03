import { randomBytes } from 'crypto'
import sharp from 'sharp'
import { serverSupabaseClient } from '#supabase/server'
import logger from '~/server/utils/logging'
import { image_ids } from '~/server/utils/sqids'

/**
 * Send image with body (image/png), file goes in here
 * use with supabase client i guess
 *
 * Uploads an image to the tournament-images bucket with a random id
 */
export default defineEventHandler(async (event) => {
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

	// could use client if RLS is implemented properly
	const client = await serverSupabaseClient(event)
	// const client = await serverSupabaseServiceRole(event)

	// generate random id for image
	const imageId = image_ids.encode(randomBytes(2))
	logger.info(imageId)

	const { data, error } = await client.storage.from('tournament-images')
		.upload(
			`${imageId}.png`, await img.toBuffer(),
			{
				contentType: 'image/png',
			},
		)

	if (error) {
		logger.error(`During ${event} - Storage Error:\n${JSON.stringify(error)}`)
		return createError({
			statusCode: 500,
			statusMessage: 'Internal Server error',
			message: 'Something unexpected happened',
		})
	}

	logger.info(`Uploaded Image to ${data.fullPath} with id ${data.id}`)

	setResponseStatus(event, 201, 'Created')
	return {
		imageId: imageId,
	}
})
