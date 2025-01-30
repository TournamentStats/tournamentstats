import { z } from 'zod'

import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

const puuid = z.string().length(78)

const player = z.object({
	puuid: puuid,
	name: z.string().min(2).max(24),
})

type Player = z.infer<typeof player>

const requestBody = z.object({
	add: z.array(player),
	remove: z.array(puuid),
})

/**
 * Accepts list of puuids to remove/add to team
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

		// check if user is allowed to edit the tournament
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

		const tournamentId = checkPermissionResponse.data.tournament_id

		const { add, remove } = await readValidatedBody(event, data => requestBody.parse(data))

		const addPlayersResponse = await client.from('tournament_participant')
			.insert(add.map(({ puuid, name }: Player) => ({
				puuid: puuid,
				tournament_id: tournamentId,
				name: name,
			})))
			.select('puuid, name')

		if (addPlayersResponse.error) {
			event.context.errors.push(addPlayersResponse.error)
			handleError(addPlayersResponse)
		}

		const removePlayersResponse = await client.from('tournament_participant')
			.delete()
			.eq('tournament_id', tournamentId)
			.in('puuid', remove)
			.select('puuid, name')

		if (removePlayersResponse.error) {
			event.context.errors.push(removePlayersResponse.error)
			handleError(removePlayersResponse)
		}

		return {
			added: addPlayersResponse.data,
			removed: removePlayersResponse.data,
		}
	},
})
