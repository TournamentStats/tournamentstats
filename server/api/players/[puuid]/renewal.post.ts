/**
 * Accepts a puuid and updates the database with riot api information (name, summoner icon)
 */
import * as z from 'zod/v4'

const _ = z.string().length(78)

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling((event) => {
		return event.toString()
	}),
})
