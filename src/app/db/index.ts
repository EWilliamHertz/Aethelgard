// src/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// We use the non-pooling connection for edge/serverless functions
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });