import { serverSupabaseClient } from '#supabase/server'

import * as z from 'zod/v4'

const Query = z.object({
	code: z.string().optional(),
	next: z.string().default('/'),
})

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const { code, next } = await getValidatedQuery(event, obj => Query.parse(obj))
		logger.info('info', { payload: { code, next } })

		if (code) {
			const client = await serverSupabaseClient(event)
			const { error } = await client.auth.exchangeCodeForSession(code)

			if (!error) {
				await sendRedirect(event, next)
			}

			logger.error('err', { payload: error })
		}
		await sendRedirect(event, '/')
	}),
})
