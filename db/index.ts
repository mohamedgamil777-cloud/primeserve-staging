import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import env from "@/env";
import * as schema from "@/db/schema"
const db = drizzle({ 
  connection: { 
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    // Hosted databases (Supabase on Vercel) need SSL; the local one doesn't.
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
	},
  schema:schema
});

export type DB = typeof db;

export {db};