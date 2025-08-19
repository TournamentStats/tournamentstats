import { install } from 'source-map-support';

export default defineNitroPlugin((nitroApp) => {
	install({ handleUncaughtExceptions: false });
	nitroApp.hooks.hook('error', (error) => {
		logger.error('unhandled exception', {
			section: 'unhandled-exception',
			payload: error,
		});
	});
});
