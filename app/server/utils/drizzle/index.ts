import { configDotenv } from 'dotenv'

import postgres from 'postgres'

import { drizzle } from 'drizzle-orm/postgres-js'

import * as relations from './relations'
import * as tables from './schema'

configDotenv()

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client, { schema: { ...tables, ...relations } })
