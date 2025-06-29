import { randomBytes } from 'crypto'
import type { H3Event } from 'h3'

import { image_ids } from '@utils/sqids'
import { logger } from '@utils/logging'

import { serverSupabaseServiceRole } from '#supabase/server'

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

export async function moveImage(event: H3Event, from: string, to: string) {
	const client = serverSupabaseServiceRole(event)

	const moveImageResponse = await client.storage.from('tournament-images')
		.move(from, to)

	if (moveImageResponse.error) {
		event.context.errors.push(moveImageResponse.error)

		if (moveImageResponse.error.name == 'NoSuchKey') {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Image id not found. Only use ids from image uploads. Upload image and try again.',
			})
		}

		throw createGenericError()
	}
}

export async function getSignedURL(event: H3Event, imagePath: string, duration: number = 60 * 60 * 24) {
	const client = serverSupabaseServiceRole(event)
	const signedUrlResponse = await client.storage.from('tournament-images')
		.createSignedUrl(
			imagePath,
			duration,
		)

	if (signedUrlResponse.error) {
		event.context.errors.push(signedUrlResponse.error)
		return undefined
	}

	return signedUrlResponse.data.signedUrl
}

export async function getSignedTournamentImage(event: H3Event, tournamentShortId: string, duration: number = 60 * 60 * 24) {
	return getSignedURL(event, `${tournamentShortId}/tournament.png`, duration)
}

export async function getSignedTeamImage(event: H3Event, tournamentShortId: string, teamShortId: string, duration: number = 60 * 60 * 24) {
	return getSignedURL(event, `${tournamentShortId}/teams/${teamShortId}.png`, duration)
}

export async function moveTournamentImage(event: H3Event, imageId: string, tournamentShortId: string) {
	const from = `uploads/${imageId}.png`
	const to = `${tournamentShortId}/tournament.png`

	await moveImage(event, from, to)

	const signedUrl = await getSignedURL(event, to)
	return { signedUrl }
}

export async function moveTeamImage(event: H3Event, imageId: string, tournamentShortId: string, teamShortId: string) {
	const from = `uploads/${imageId}.png`
	const to = `${tournamentShortId}/teams/${teamShortId}.png`

	await moveImage(event, from, to)

	const signedUrl = await getSignedURL(event, to)
	return { signedUrl }
}

export async function deleteTournamentImages(event: H3Event, tournamentShortId: string) {
	const client = serverSupabaseServiceRole(event)
	const listFilesResponse = await client.storage.from('tournament-images').list(`${tournamentShortId}/`)

	if (listFilesResponse.error) {
		logger.error('Error during listing files to delete', { section: 'Storage', error: listFilesResponse.error })
		return
	}

	const removeFilesResponse = await client.storage.from('tournament-images').remove(listFilesResponse.data.map(file => file.name))
	if (removeFilesResponse.error) {
		logger.error('Error during deleting files', { section: 'Storage', error: removeFilesResponse.error })
	}
}

export async function deleteTeamImage(event: H3Event, tournamentShortId: string, teamShortId: string) {
	const client = serverSupabaseServiceRole(event)
	const removeFileResponse = await client.storage.from('tournament-images').remove([`${tournamentShortId}/teams/${teamShortId}.png`])
	if (removeFileResponse.error) {
		logger.error('Error during deleting file', { section: 'Storage', error: removeFileResponse.error })
	}
}
