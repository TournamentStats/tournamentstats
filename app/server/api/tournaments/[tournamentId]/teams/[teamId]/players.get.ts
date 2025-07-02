import { z } from 'zod'

const puuid = z.string().length(78)

const player = z.object({
	puuid: puuid,
	name: z.string().min(2).max(24),
})

const requestBody = z.object({
	add: z.array(player),
	remove: z.array(puuid),
})

/**
 * GET /api/tournaments/[tournamentId]/teams/[teamId]/players
 *
 * Gets all members of the team
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const tournamentShortId = getRouterParam(event, 'tournamentId')
		if (!tournamentShortId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No tournament id given',
			})
		}

		const teamShortId = getRouterParam(event, 'teamId')
		if (!teamShortId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No team id given',
			})
		}

		const _ = await readValidatedBody(event, data => requestBody.parse(data))
	},
})
