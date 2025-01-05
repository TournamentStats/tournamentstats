import { serverSupabaseServiceRole } from '#supabase/server'

import { logAPI } from '~/server/utils/logging'

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user
		const tournamentId = getRouterParam(event, 'tournamentId')

		const client = await serverSupabaseServiceRole(event)

		const response = await client.from('tournament')
			.select('short_id, owner_id, name, is_private, start_date, end_date, image_path')
			.eq('short_id', tournamentId)
			.single()

		const { data, error } = response

		if (error) {
			event.context.error = error
			handleError(user, response)
		}

		if (!data || data.is_private) {
			throw createError({
				statusCode: 403,
				statusMessage: 'Forbidden',
				message: `You are not authorized to access this tournament.`,
			})
		}

		return data
	},
})
