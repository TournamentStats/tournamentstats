import { z } from 'zod'
import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

import { Format } from '~/types/database.types'

const teamId = z.string()

const requestBody = z.object({
	team1_id: teamId,
	team2_id: teamId,
	format: z.nativeEnum(Format),
})

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

		const client = serverSupabaseServiceRole(event)

		// check if user is owner of the tournament
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
				message: 'Tournament not found',
			})
		}

		const {
			team1_id: team1_shortId,
			team2_id: team2_shortId,
			format,
		} = await readValidatedBody(event, data => requestBody.parse(data))

		const getTeamIdsResponse = await client.from('team')
			.select('short_id, team_id')
			.in('short_id', [team1_shortId, team2_shortId])

		if (getTeamIdsResponse.error) {
			event.context.errors.push(getTeamIdsResponse.error)
			handleError(getTeamIdsResponse)
		}

		const team1Id = getTeamIdsResponse.data
			.find(team => team.short_id === team1_shortId)?.team_id
		const team2Id = getTeamIdsResponse.data
			.find(team => team.short_id === team2_shortId)?.team_id

		if (!(team1Id && team2Id)) {
			const missingMessage = !team1Id
				? 'Team 1'
				: !team2Id
						? 'Team 2'
						: 'Both teams'

			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: `${missingMessage} not found`,
			})
		}

		const createMatchupResponse = await client.from('matchup')
			.insert({
				team1_id: team1Id,
				team2_id: team2Id,
				format: format,
				tournament_id: checkPermissionResponse.data.tournament_id })
			.select(
				'matchup_id:short_id, format',
			)
			.single()

		if (createMatchupResponse.error) {
			event.context.errors.push(createMatchupResponse.error)
			handleError(createMatchupResponse)
		}

		return {
			...createMatchupResponse.data,
			team1_id: team1_shortId,
			team2_id: team2_shortId,
			tournament_id: shortTournamentId,
		}
	},
})
