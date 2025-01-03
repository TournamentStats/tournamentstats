import { serverSupabaseServiceRole } from '#supabase/server'
import handleError from '~/server/utils/handleError'

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseServiceRole(event)
	const { data, error, status, statusText } = await client.from('tournament').select('name').is('is_private', false)

	handleError(data, status, statusText, error)
	return data
})
