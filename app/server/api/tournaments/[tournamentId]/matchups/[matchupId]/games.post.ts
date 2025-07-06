import * as z from 'zod/v4'

const _ = z.object({
	game_id: z.number(),
})

/**
 * POST /api/tournaments/[tournamentId]/matchups/[matchupId]/games
 *
 * Adds a game to a matchup
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
	handler: (event) => {
		return event.toString()
	},
})
