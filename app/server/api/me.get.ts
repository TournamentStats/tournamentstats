export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: (event) => {
		const user = event.context.auth.user
		const headers = getHeaders(event)
		return {
			user,
			headers,
		}
	},
})
