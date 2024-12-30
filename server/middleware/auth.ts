import { H3Error } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

/**
 * Sets the authentication of the Request. Currently only supports having an active session.
 * In the future maybe authentication using api keys.
 */
export default defineEventHandler(async (event) => {
	let user = null
	try {
		user = serverSupabaseUser(event)
	}
	catch (e) {
		// Session not found
		if (e instanceof H3Error) {
			event.context.auth = { user: null }
		}
		else {
			throw e
		}
	}
	event.context.auth = { user: user }
})
