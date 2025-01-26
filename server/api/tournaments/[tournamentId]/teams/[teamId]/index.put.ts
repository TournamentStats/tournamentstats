import { z } from 'zod'

import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

const requestBody = z.object({
	name: z.string().min(3).max(32),
})

/**
 * POST /api/tournaments/[tournamentId]/teams
 *
 * Creates an team in a specific tournament
 *
 * RequestBody: information about the team
 * 	name: string
 *
 * Returns: information about the team
 * 	id: string
 * 	name: string
 *  tournament: {
 *  	tournament_id: string
 *  }
 *
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

		const shortTeamId = getRouterParam(event, 'teamId')

		if (!shortTeamId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No team id given',
			})
		}

		const client = serverSupabaseServiceRole(event)

		// check if user is owner of the tournament
		const checkPermissionResponse = await client.from('tournament')
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

		const { name } = await readValidatedBody(event, requestBody.parse)

		const editTeamResponse = await client.from('team')
			.update({ name: name })
			.eq('short_id', shortTeamId)
			.eq('tournament_id', checkPermissionResponse.data.tournament_id)
			.select(`
				team_id:short_id,
				name,
				tournament (
					tournament_id:short_id
				)
			`)
			.maybeSingle()

		if (editTeamResponse.error) {
			event.context.errors.push(editTeamResponse.error)
			handleError(editTeamResponse)
		}

		if (!editTeamResponse.data) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Team not found',
			})
		}

		return editTeamResponse.data
	},
})
