import * as z from 'zod/v4'

import { Format } from '~~/types/database.types'

const teamId = z.string()

const _ = z.object({
	team1_id: teamId,
	team2_id: teamId,
	format: z.nativeEnum(Format),
})

/**
 * POST /api/tournaments/[tournamentId]/matchups/
 *
 * Creates a matchup between two teams in a specific tournament
 *
 * Returns: information about the matchup
 * 	team1: { team_id: string }
 * 	team2: { team_id: string }
 * 	tournament_id: string
 * 	format: Format
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
