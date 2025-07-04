/**
 * GET /api/tournaments/[tournamentId]/matchups
 *
 * Gets all matchups for a tournament
 *
 * Returns: Array of matchups
 *  matchups: [
 * 		{
 * 			team1: { team_id: string },
 * 			team2: { team_id: string },
 * 			format: string
 * 		}
 * ]
 * 	tournament_id: string
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const x = await db.select().from(tournamentParticipant)
	},
})
