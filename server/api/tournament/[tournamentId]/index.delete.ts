import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler((event) => {
	const user = event.context.auth.user
	const tournamentId = getRouterParam(event, 'tournamentId')

	const client = await serverSupabaseServiceRole(event)

	const response = await client.from('tournament')
		.delete()
		.eq('short_id', tournamentId)

	handleError(user, response)
	return sendNoContent(event, 204)
})
