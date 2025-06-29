import sharp from 'sharp'

/**
 * POST /api/tournaments/images
 *
 * Send image with body (image/png), file goes in here
 * use with supabase client i guess
 *
 * Uploads an image to the tournament-images bucket with a random id
 *
 * ResponseBody: {
 * 	image_id: string
 * }
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const contentType = getHeader(event, 'Content-Type')

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
				message: 'Image format not png',
			})
		}

		const imageId = await uploadImage(event, await img.toBuffer())

		setResponseStatus(event, 201, 'Created')
		return { imageId: imageId }
	},
})
