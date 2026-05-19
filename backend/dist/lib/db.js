import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env.js';
import * as schema from '../db/schema/index.js';
const isCloudDB = env.DATABASE_URL.includes('neon.tech') ||
    env.DATABASE_URL.includes('supabase.com') ||
    env.DATABASE_URL.includes('railway.app') ||
    env.DATABASE_URL.includes('sslmode=require');
const client = postgres(env.DATABASE_URL, {
    ssl: isCloudDB ? 'require' : undefined,
    max: 10,
});
export const db = drizzle(client, { schema });
//# sourceMappingURL=db.js.map