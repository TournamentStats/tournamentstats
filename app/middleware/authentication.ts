/**
 * Used on routes that should only be accessible to authenticated users.
 * If not logged in, redirects to login page with a query param from where the user came
 */
export default defineNuxtRouteMiddleware((to, _from) => {
	const session = useSupabaseSession();

	if (!session.value) {
		return navigateTo({ path: '/login', query: { redirectTo: to.path } });
	}
});
