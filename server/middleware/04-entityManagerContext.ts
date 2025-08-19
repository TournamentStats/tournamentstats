import { getORM } from '../db/mikro-orm';
import type { SqlEntityManager } from '@mikro-orm/postgresql';

declare module 'h3' {
	interface H3EventContext { em: SqlEntityManager }
}

logger.success('Entity Manager', { section: 'Middleware' });

export default defineEventHandler(withErrorHandling(async (event) => {
	event.context.em = (await getORM()).em.fork();
}));
