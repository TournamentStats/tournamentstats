import type { User } from '@supabase/supabase-js'
import { serverSupabaseServiceRole } from '#supabase/server'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user as User
		const tournamentId = getRouterParam(event, 'tournamentId')

		const client = await serverSupabaseServiceRole(event)

		// returns a row if a tournament is found where owner and short_id overlap
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
				message: 'You are not authorized to delete this tournament.',
			})
		}

		const deleteTournamentResponse = await client.from('tournament')
			.delete()
			.eq('tournament_id', data.tournament_id)
			.select()
			.single()

		if (deleteTournamentResponse.error) {
			event.context.error = deleteTournamentResponse.error
			handleError(user, deleteTournamentResponse)
		}

		if (deleteTournamentResponse.data.image_path) {
			const removeImageResponse = await client.storage.from('tournament-images').remove(data.image_path)
			if (error) {
				event.context.error = removeImageResponse.error
				throw createError({
					statusCode: 500,
					statusMessage: 'Internal Server Error',
					message: 'Tournament deleted sucessfully. You propably don\'t have to care.',
				})
			}
		}

		return sendNoContent(event, 204)
	},
})
