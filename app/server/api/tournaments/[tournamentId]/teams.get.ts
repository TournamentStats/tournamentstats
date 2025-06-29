/**
 * GET tournaments/[tournamentId]/teams
 *
 * Gets all teams in the tournament
 *
 * ResponseBody: team[]
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
	},
})
