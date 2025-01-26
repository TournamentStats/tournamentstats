/**
 * We assume that this middleware is only used on routes that need authentication
 */
export default defineNuxtRouteMiddleware((to, _from) => {
	const user = useSupabaseUser()

	if (!user.value) {
		return abortNavigation('Not authenticated')
	}

	if (to.params.userId != user.value.id) {
		return abortNavigation('No permissions')
	}
})
