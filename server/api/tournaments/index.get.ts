import { serverSupabaseServiceRole } from '#supabase/server'
import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const client = await serverSupabaseServiceRole(event)
		const getTournamentResponse = await client.from('available_tournaments')
			.select('tournament_id::short_id, name')

		if (getTournamentResponse.error) {
			event.context.error = getTournamentResponse.error
			handleError(getTournamentResponse.error)
		}

		return getTournamentResponse.data
	},
})
