import type { User } from '@supabase/supabase-js'
import { serverSupabaseServiceRole } from '#supabase/server'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

/**
 * DELETE /tournments/[tournamentId]
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user as User
		const shortTournamentId = getRouterParam(event, 'tournamentId')

		if (!shortTournamentId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No tournament id given',
			})
		}

		const client = serverSupabaseServiceRole(event)

		const deleteTournamentResponse = await client.from('tournament')
			.delete()
			.eq('short_id', shortTournamentId)
			.eq('owner_id', user.id)
			.select()
			.maybeSingle()

		if (deleteTournamentResponse.error) {
			event.context.errors.push(deleteTournamentResponse.error)
			handleError(user, deleteTournamentResponse)
		}

		if (!deleteTournamentResponse.data) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not found',
				message: `Tournemnt <${shortTournamentId}> not found`,
			})
		}

		// theoretical we can return here and execute the deletion in the background

		// delete all files in the tournament folder
		const listFilesResponse = await client.storage.from('tournament-images').list(`${shortTournamentId}/`)

		if (listFilesResponse.error) {
			event.context.errors.push(listFilesResponse.error)
		}
		else {
			const removeFilesResponse = await client.storage.from('tournament-images').remove(listFilesResponse.data.map(file => file.name))
			if (removeFilesResponse.error) {
				event.context.errors.push(removeFilesResponse.error)
			}
		}

		return sendNoContent(event, 204)
	},
})
