/**
 * GET /api/tournaments/[tournamentId]/matchups/[matchupId]
 *
 * Returns a specific matchup for a tournament
 *
 * Returns: information about the matchup
 * 	team1: { team_id: string }
 * 	team2: { team_id: string }
 * 	tournament_id: string
 * 	format: Format
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling((event) => {
		return event.toString();
	}),
});
