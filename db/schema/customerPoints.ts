import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { tiers } from "./tiers";
import { users } from "./users";
import { stores } from "./stores";

export const customerPoints = pgTable('customer_points', {
  storeId: uuid('store_id').notNull().references(()=>stores.id,{"onDelete":"cascade"}),  
  customerId: uuid('customer_id').notNull().references(() => users.id,{"onDelete":"cascade"}).primaryKey(), // FK to your `customers` table
  points: integer('points').notNull().default(0),
  tierId: uuid('tier_id').references(() => tiers.id,{"onDelete":"set null"}),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});
