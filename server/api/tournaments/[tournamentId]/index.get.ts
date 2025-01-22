import { serverSupabaseServiceRole } from '#supabase/server'

import { logAPI } from '~/server/utils/logging'

/**
 * GET tournaments/[tournamentId]
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

		const client = await serverSupabaseServiceRole(event)

		const getTournamentResponse = await client.from('available_tournaments')
			.select('short_id, owner_id, name, is_private, start_date, end_date')
			.eq('short_id', shortTournamentId)
			.single()

		const { data, error } = getTournamentResponse

		if (getTournamentResponse.error) {
			event.context.error = error
			handleError(getTournamentResponse)
		}

		if (!data) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Tournament not found',
			})
		}

		return data
	},
})
