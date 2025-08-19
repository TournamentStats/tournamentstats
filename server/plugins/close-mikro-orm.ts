import { closeORM } from '../db/mikro-orm';

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook('close', async () => {
		try {
			await closeORM();
		}
		catch (e: unknown) {
			logger.error('Error during closing DB Connection', { error: e });
		}
	});
});
