/**
 * GET /api/tournaments/[tournamentId]/teams/[teamId]/stats
 *
 * Gets stats of a team
 *
 * Returns: team
 */
export default defineEventHandler({
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
