/**
 * Accepts a puuid and updates the database with riot api information (name, summoner icon)
 */
import { z } from 'zod'

const _ = z.string().length(78)

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
