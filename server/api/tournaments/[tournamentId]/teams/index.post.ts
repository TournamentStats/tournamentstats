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

		if (tournamentId == null) {
			throw createError({
				status: 404,
				message: 'Not Found',
				statusMessage: 'No tournament id given',
			})
		}

		// we could also use the authenticated client if RLS is properly setup
		// const client = await serverSupabaseClient(event)
		const client = serverSupabaseServiceRole(event)

		// check permissions
		const checkPermissionsResponse = await client.from('tournament')
			.select('tournament_id')
			.eq('short_id', tournamentId)
			.eq('owner_id', user.id)
			.single()

		if (checkPermissionsResponse.error) {
			event.context.error = checkPermissionsResponse.error
			handleError(checkPermissionsResponse)
		}

		if (!checkPermissionsResponse.data) {
			throw createError({
				statusCode: 403,
				statusMessage: 'Forbidden',
				message: 'You are not authorized to add teams to this tournament.',
			})
		}

		const teamInsertResponse = await client.from('team')
			.insert({ name: name, tournament_id: checkPermissionsResponse.data.tournament_id })
			.select(
				'short_id, name',
			)
			.single()

		setResponseStatus(event, 201, 'Created')
		return teamInsertResponse.data
	},
})
