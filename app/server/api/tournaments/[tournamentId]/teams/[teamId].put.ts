import { z } from 'zod'

const _requestBody = z.object({
	name: z.string().min(3).max(32),
	shorthand: z.string().min(1).max(5).optional(),
	image_id: z.string().optional(),
})

/**
 * Put /api/tournaments/[tournamentId]/teams/[teamId]
 *
 * Modifies a team in the tournament. Must specify all parts
 *
 * ReturnBody: team
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: (event) => {
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
	},
})
