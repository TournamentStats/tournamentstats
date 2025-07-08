/**
 * GET tournaments/[tournamentId]/participants
 *
 * Gets all participants of the tournament
 *
 * ResponseBody: player[]
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling((event) => {
		const tournamentShortId = getRouterParam(event, 'tournamentId')
		if (!tournamentShortId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No tournament id given',
			})
		}
	 })
})
