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
 * POST /api/tournaments/[tournamentId]/teams
 *
 * Creates an team in a specific tournament
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

		const shortTournamentId = getRouterParam(event, 'tournamentId')

		if (!shortTournamentId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No tournament id given',
			})
		}

		const client = serverSupabaseServiceRole(event)

		// check if user is owner of the tournament
		const checkPermissionResponse = await client.from('available_tournaments')
			.select('tournament_id')
			.eq('short_id', shortTournamentId)
			.eq('owner_id', user.id)
			.maybeSingle()

		if (checkPermissionResponse.error) {
			event.context.errors.push(checkPermissionResponse.error)
			handleError(checkPermissionResponse)
		}

		if (!checkPermissionResponse.data) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Tournament not found',
			})
		}

		const { name, image_id: imageId } = await readValidatedBody(event, requestBody.parse)

		const createTeamResponse = await client.from('team')
			.insert({ name: name, tournament_id: checkPermissionResponse.data.tournament_id })
			.select(
				'team_id:short_id, tournament_id, name',
			)
			.single()

		if (createTeamResponse.error) {
			event.context.errors.push(createTeamResponse.error)
			handleError(createTeamResponse)
		}

		const teamShortId = createTeamResponse.data!.team_id
		let imageUrl: string | undefined
		// try to move the image if imageId is provived, rollback if imageId is not found or something unexpected happens
		if (imageId) {
			// maybe here should we use the authenticated client?
			const moveImageResponse = await client.storage.from('tournament-images')
				.move(`uploads/${imageId}.png`, `${shortTournamentId}/teams/${createTeamResponse.data!.short_id}.png`)

			if (moveImageResponse.error) {
				event.context.errors.push(moveImageResponse.error)

				await client.from('team')
					.delete()
					.eq('short_id', teamShortId)

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
					`${teamShortId}/tournament.png`,
					60 * 60 * 24,
				)

			if (signedUrlResponse.error) {
				event.context.errors.push(signedUrlResponse.error)

				await client.from('team')
					.delete()
					.eq('short_id', teamShortId)

				throw createError({
					statusCode: 500,
					statusMessage: 'Internal Server Error',
					message: 'Something unexpected happened.',
				})
			}
			imageUrl = signedUrlResponse.data?.signedUrl
		}

		setResponseStatus(event, 201, 'Created')
		return { ...createTeamResponse.data!, image_url: imageUrl }
	},
})
