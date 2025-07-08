import * as z from 'zod/v4'

const pathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
})

/**
 * GET /api/tournaments/[tournamentId]/teams/[teamId]/players
 *
 * Gets all members of the team
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
	}),
})
