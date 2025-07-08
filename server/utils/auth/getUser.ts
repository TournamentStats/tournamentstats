import { H3Error } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { User } from '@supabase/supabase-js'

export async function getAuthUser(event: H3Event): Promise<User | null> {
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
