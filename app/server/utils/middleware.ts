import type { H3Event } from 'h3'
import type { User } from '@supabase/supabase-js'

function isAuthenticated(event: H3Event): event is H3Event & { context: { auth: { user: User } } } {
	return event.context.auth.user !== null
}

export function authentication(event: H3Event): void {
	if (!isAuthenticated(event)) {
		throw createError({
			status: 401,
			message: 'Unauthorized',
			statusMessage: 'Please authorize by logging in',
		})
	}
}
