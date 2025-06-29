import { H3Error } from 'h3'
import type { User } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

declare module 'h3' {
	interface H3EventContext {
		auth: { user: User | null }
	}
}

/**
 * Sets the authentication of the Request. Currently only supports having an active session.
 * In the future maybe authentication using api keys.
 */
export default defineEventHandler(async (event) => {
	try {
		const user = await serverSupabaseUser(event)
		event.context.auth = { user: user }
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
})
