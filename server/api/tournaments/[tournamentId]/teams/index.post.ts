import { z } from 'zod'

import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

const requestBody = z.object({
	name: z.string().min(3).max(32),
	imageId: z.string().optional(),
})

/**
 * POST /api/tournaments/[tournamentId]/teams
 *
 * Creates a team for tournament
 *
 * RequestBody: information about the tournament
 * 	name: string
 * 	isPrivate: string
 * 	imageId?: string
 *
 * Returns: Information about the created tournament
 * 	short_id: string
 * 	owner_id: string (uuid)
 * 	name: string
 * 	is_private : boolean
 * 	start_date: string (iso date)
 * 	end_date: string (iso date)
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user

		if (user == null) {
			throw createError({
				status: 401,
				message: 'Unauthorized',
				statusMessage: 'Please authorize by logging in',
			})
		}

		const { name, imageId } = await readValidatedBody(event, requestBody.parse)
		const tournamentId = getRouterParam(event, 'tournamentId')

		// we could also use the authenticated client if RLS is properly setup
		// const client = await serverSupabaseClient(event)
		const client = await serverSupabaseServiceRole(event)

		// check permissions
		const checkPermissionsResponse = await client.from('tournament')
			.select('tournament_id')
			.eq('short_id', tournamentId)
			.eq('owner_id', user.id)
			.single()

		const { data, error } = checkPermissionsResponse
		if (error) {
			event.context.error = error
			handleError(user, checkPermissionsResponse)
		}

		if (!data) {
			throw createError({
				statusCode: 403,
				statusMessage: 'Forbidden',
				message: 'You are not authorized to add teams to this tournament.',
			})
		}

		const teamInsertResponse = await client.from('tournament')
			.insert({ name: name, tournament_id: data.tournament_id, image_path: `${imageId}.png` })
			.select(
				'short_id, owner_id, name, is_private, start_date, end_date, image_path',
			)

		handleError(user, teamInsertResponse)
		setResponseStatus(event, 201, 'Created')
		return data
	},
})
