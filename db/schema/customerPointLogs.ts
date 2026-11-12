import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { pointEarningMethods } from "./pointEarningMethods";
import { rewards } from "./rewards";
import { stores } from "./stores";
import { createSelectSchema } from "drizzle-zod";

export const customerPointLogs = pgTable('customer_point_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').notNull().references(()=> users.id,{"onDelete":"cascade"}),
  storeId: uuid('store_id').references(()=>stores.id,{"onDelete":"cascade"}),
  methodId: uuid('method_id').references(() => pointEarningMethods.id),
  rewardId: uuid('reward_id').references(() => rewards.id),
  type: text('type', { enum: ['earn', 'redeem'] }).notNull(),
  points: integer('points').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
//   meta: jsonb('meta'),
});


export const selectCustomerPointLogSchema = createSelectSchema(customerPointLogs)
