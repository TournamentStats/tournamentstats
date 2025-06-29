import { z } from 'zod'

const pathParams = z.object({
	tournamentId: z.string().min(1),
	riotId: z.string().regex(/^[\p{L}\p{N}]{3,16}-[\p{L}\p{N}]{3,5}$/u),
})
/**
 * GET tournaments/[tournamentId]/participants/[riotId]
 *
 * Gets all participants of the tournament
 *
 * ResponseBody: player[]
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const { tournamentId, riotId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
		console.log(tournamentId, riotId)
	},
})
