import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const storeBranches = pgTable('store_branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('tenant_id').references(() => stores.id).notNull(),

  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  isActive: boolean('is_active').notNull().default(true),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
