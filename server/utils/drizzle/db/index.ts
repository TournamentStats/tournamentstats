import postgres from 'postgres';

import { drizzle } from 'drizzle-orm/postgres-js';

import * as relations from './relations';
import * as tables from './schema';

const client = postgres(useRuntimeConfig().databaseURL);
export const db = drizzle(client, { schema: { ...tables, ...relations } });
