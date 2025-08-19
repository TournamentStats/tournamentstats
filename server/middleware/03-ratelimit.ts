logger.success('Ratelimit', { section: 'Middleware' });

export default defineEventHandler(
	withErrorHandling(ratelimit()),
);
