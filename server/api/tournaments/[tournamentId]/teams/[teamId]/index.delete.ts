import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

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

		// check if user is allowed to see the tournament and is owner
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
				message: `Tournament not found`,
			})
		}

		const deleteTeamResponse = await client.from('team')
			.delete()
			.eq('tournament_id', checkPermissionResponse.data.tournament_id)
			.eq('short_id', shortTeamId)
			.select('short_id')
			.maybeSingle()

		if (deleteTeamResponse.error) {
			event.context.errors.push(deleteTeamResponse.error)
			handleError(deleteTeamResponse)
		}

		if (!deleteTeamResponse.data) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Team not found',
			})
		}

		const deleteImageResponse = await client.storage.from('tournament-images')
			.remove([`${shortTournamentId}/teams/${shortTeamId}.png`])

		if (deleteImageResponse.error) {
			event.context.errors.push(deleteImageResponse.error)
		}

		sendNoContent(event, 204)
	},
})
