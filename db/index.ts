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
	},
  schema:schema
});

export type DB = typeof db;

export {db};