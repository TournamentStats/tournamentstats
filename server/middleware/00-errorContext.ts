logger.success('Error', { section: 'Middleware' });

export default defineEventHandler((event) => {
	event.context.errors = [];
});
