import { boolean, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { rewards } from "./rewards";
import { orders } from "./orders";
import { createSelectSchema } from "drizzle-zod";
import { stores } from "./stores";

export const customerRewardRedemptions = pgTable('customer_reward_redemptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').notNull().references(()=>users.id),
  rewardId: uuid('reward_id').notNull().references(() => rewards.id),
  storeId: uuid('store_id').notNull().references(() => stores.id),
  orderId: uuid('order_id').references(() => orders.id),
  redeemedAt: timestamp('redeemed_at', { mode: 'date' }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  used: boolean('used').default(false),
});


export const selectCustomerRewardRedemptionsSchema = createSelectSchema(customerRewardRedemptions);
