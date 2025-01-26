import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'

/**
 * GET /api/tournaments/[tournamentId]/teams/[teamId]
 *
 * Returns a specific team in a specific tournament
 *
 * Returns: information about the team
 * 	team_id: string
 * 	tournament_id: string
 * 	name: string
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
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

		// check if user is allowed to see the tournament
		const checkPermissionResponse = await client.from('available_tournaments')
			.select('tournament_id')
			.eq('short_id', shortTournamentId)
			.maybeSingle()

		if (checkPermissionResponse.error) {
			event.context.errors.push(checkPermissionResponse.error)
			handleError(checkPermissionResponse)
		}

		if (!checkPermissionResponse.data) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: `Tournament not found`,
			})
		}

		const getTeamResponse = await client.from('team')
			.select(`
				team_id:short_id,
				name,
				tournament (
					tournament_id:short_id
				)
			`)
			.eq('tournament_id', checkPermissionResponse.data.tournament_id)
			.eq('short_id', shortTeamId)
			.maybeSingle()

		if (getTeamResponse.error) {
			event.context.errors.push(getTeamResponse.error)
			handleError(getTeamResponse)
		}

		if (!getTeamResponse.data) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Team not found',
			})
		}

		return getTeamResponse.data
	},
})
