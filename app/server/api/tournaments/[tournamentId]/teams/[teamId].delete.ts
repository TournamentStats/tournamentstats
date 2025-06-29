/**
 * DELETE /api/tournaments/[tournamentId]/teams/[teamId]
 *
 * Deletes a team in the tournament
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
				message: 'No tournament id given',
			})
		}

		sendNoContent(event)

		// delete team image
		void deleteTeamImage(event, tournamentShortId, teamShortId)
	},
})
