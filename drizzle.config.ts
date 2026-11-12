import { defineConfig } from 'drizzle-kit';
import env from './env';


export default defineConfig({
	schema: "./db/schema/index.ts", // Path to your schema file
	out: "./drizzle", // Directory for migrations
    dialect: 'postgresql',
	migrations:{
		schema:"public"
	},
    dbCredentials: {
		host: env.DB_HOST,
		port: Number(env.DB_PORT),
		database: env.DB_NAME,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		ssl:{
			rejectUnauthorized: false, // accept self-signed certs
		}
	},
});
