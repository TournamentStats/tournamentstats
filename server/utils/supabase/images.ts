/**
 * Helper functions for all about managing user uploads.
 */

import { randomBytes } from 'crypto'
import type { H3Event } from 'h3'

import { image_ids } from '~~/server/utils/sqids'
import { logger } from '~~/server/utils/logging'

import { serverSupabaseServiceRole } from '#supabase/server'

/**
 * Uploads an image to the generic uploads/ path inside the
 * tournament-images. Images in this folder are temporary and gets purged
 * after some time.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param imageData image data to upload
 * @returns the imageId of the uploaded image
 */
export async function uploadImage(event: H3Event, imageData: Buffer) {
	const imageId = image_ids.encode(Array.from(randomBytes(6)))
	const client = serverSupabaseServiceRole(event)
	const uploadImageResponse = await client.storage.from('tournament-images')
		.upload(
			`uploads/${imageId}.png`, imageData,
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

	logger.info(`Uploaded Image to ${uploadImageResponse.data.fullPath} with id ${uploadImageResponse.data.id}`, { section: 'Storage' })
	return imageId
}

/**
 * Moves images inside the tournament-images bucket.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param from Path to the image that should be moved
 * @param to Path where the image should be moved to
 */
export async function moveImage(event: H3Event, from: string, to: string) {
	const client = serverSupabaseServiceRole(event)

	const moveImageResponse = await client.storage.from('tournament-images')
		.move(from, to)

	if (moveImageResponse.error) {
		event.context.errors.push(moveImageResponse.error)

		if (moveImageResponse.error.name === 'NoSuchKey') {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Image id not found. Only use ids from image uploads. Upload image and try again.',
			})
		}

		throw createGenericError()
	}
}

/**
 * Gets a signed url to the specified image.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param imagePath Path to the image in the tournament-images bucket
 * @param duration How long the url is valid. Defaults to 1 day
 * @returns signed Url to the image
 */
export async function getSignedURL(event: H3Event, imagePath: string, duration: number = 60 * 60 * 24) {
	const client = serverSupabaseServiceRole(event)
	const signedUrlResponse = await client.storage.from('tournament-images')
		.createSignedUrl(
			imagePath,
			duration,
		)

	if (signedUrlResponse.error) {
		if (signedUrlResponse.error.message !== 'Object not found') {
			event.context.errors.push(signedUrlResponse.error)
		}
		return null
	}

	return signedUrlResponse.data.signedUrl
}

/**
 * Gets a signed url to the specified tournament image.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param tournamentShortId The shortid of the requested tournament
 * @param duration How long the url is valid. Defaults to 1 day
 * @returns signed Url to the image
 */
export async function getSignedTournamentImage(event: H3Event, tournamentShortId: string, duration: number = 60 * 60 * 24) {
	return getSignedURL(event, `${tournamentShortId}/tournament.png`, duration)
}
/**
 * Gets a signed url to the specified team image.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param tournamentShortId The shortid of the requested tournament
 * @param teamShortId the shortid of the requested team
 * @param duration How long the url is valid. Defaults to 1 day
 * @returns signed Url to the image
 */
export async function getSignedTeamImage(event: H3Event, tournamentShortId: string, teamShortId: string, duration: number = 60 * 60 * 24) {
	return getSignedURL(event, `${tournamentShortId}/teams/${teamShortId}.png`, duration)
}

/**
 * Moves an uploaded tournament image into the tournament folder.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param imageId imageId of the previously uploaded image
 * @param tournamentShortId The shortid of the requested tournament
 * @returns signed Url to the moved image
 */
export async function moveTournamentImage(event: H3Event, imageId: string, tournamentShortId: string) {
	const from = `uploads/${imageId}.png`
	const to = `${tournamentShortId}/tournament.png`

	await moveImage(event, from, to)

	const signedUrl = await getSignedURL(event, to)
	return { signedUrl }
}

/**
 * Moves an uploaded team image into the tournament folder.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param imageId imageId of the previously uploaded image
 * @param tournamentShortId The shortid of the requested tournament
 * @param teamShortId the shortid of the requested team
 * @returns signed Url to the moved image
 */
export async function moveTeamImage(event: H3Event, imageId: string, tournamentShortId: string, teamShortId: string) {
	const from = `uploads/${imageId}.png`
	const to = `${tournamentShortId}/teams/${teamShortId}.png`

	await moveImage(event, from, to)

	const signedUrl = await getSignedURL(event, to)
	return { signedUrl }
}

/**
 * Deletes the tournament image and all related team images.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param tournamentShortId The shortid of the requested tournament
 */
export async function deleteTournamentImages(event: H3Event, tournamentShortId: string) {
	const client = serverSupabaseServiceRole(event)
	const listFilesResponse = await client.storage.from('tournament-images')
		.list(`${tournamentShortId}/`)

	if (listFilesResponse.error) {
		logger.error('Error during listing files to delete', {
			section: 'Storage', error: listFilesResponse.error,
		})
		return
	}

	const removeFilesResponse = await client.storage.from('tournament-images')
		.remove(listFilesResponse.data.map(file => file.name))

	if (removeFilesResponse.error) {
		logger.error('Error during deleting files', {
			section: 'Storage', error: removeFilesResponse.error,
		})
	}
}

/**
 * Deletes the team's image in the tournament-images bucket.
 *
 * @param event Event of the EventHandler. Needed for supabase
 * @param tournamentShortId The shortid of the requested tournament
 * @param teamShortId the shortid of the requested team
 */
export async function deleteTeamImage(event: H3Event, tournamentShortId: string, teamShortId: string) {
	const client = serverSupabaseServiceRole(event)
	const removeFileResponse = await client.storage.from('tournament-images').remove([`${tournamentShortId}/teams/${teamShortId}.png`])
	if (removeFileResponse.error) {
		logger.error('Error during deleting file', {
			section: 'Storage', error: removeFileResponse.error,
		})
	}
}
