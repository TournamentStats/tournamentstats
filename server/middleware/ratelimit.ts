export default defineEventHandler(
	withErrorHandling(ratelimit()),
)
