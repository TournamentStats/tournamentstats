import { serverSupabaseServiceRole } from '#supabase/server'
import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const client = await serverSupabaseServiceRole(event)
		const { data, error, status, statusText } = await client.from('tournament').select('short_id, name').is('is_private', false)

		handleError(data, status, statusText, error)
		return data
	},
})
