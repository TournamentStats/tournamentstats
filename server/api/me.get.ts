export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling((event) => {
		const user = event.context.auth.user
		const headers = getHeaders(event)
		return {
			user,
			headers,
		}
	 })
})
