import { H3Error } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { User } from '@supabase/supabase-js'

export async function getUser(event: H3Event): Promise<User | null> {
	try {
		const user = await serverSupabaseUser(event)
		return user
	}
	catch (e) {
		if (e instanceof H3Error) {
			return null
		}
		throw e
	}
}

export async function requireAuthorization(event: H3Event): Promise<User> {
	const user = await getUser(event)

	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Missing Authorization',
			message: 'Couldn\'t retrieve your session. Make sure you are logged in and cookies are enabled.',
		})
	}

	return user
}
