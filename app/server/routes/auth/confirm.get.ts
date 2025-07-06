import { serverSupabaseClient } from '#supabase/server'
import type { EmailOtpType } from '@supabase/supabase-js'

import * as z from 'zod/v4'

const Query = z.object({
	token_hash: z.string().optional(),
	type: z.enum([
		'signup',
		'invite',
		'magiclink',
		'recovery',
		'email_change',
		'email',
	]).optional().overwrite((s): EmailOtpType | undefined => s),
	next: z.string().default('/'),
})

export default defineEventHandler({
	handler: async (event) => {
		const { token_hash, type, next } = await getValidatedQuery(event, obj => Query.parse(obj))

		if (token_hash && type) {
			const client = await serverSupabaseClient(event)

			const { error } = await client.auth.verifyOtp({
				type,
				token_hash,
			})

			if (!error) {
				await sendRedirect(event, next)
			}
		}
		await sendRedirect(event, '/auth/error')
	},
})
