import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const rewardTypes = ['discount', 'shipping', 'access'] as const
export const rewardTypesMap = {
  "discount":"Discount",
  "shipping":"Free Shipping",
  "access":"Early Access",
  // "product":"Free Product",
}     


export const rewards = pgTable('rewards', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').notNull().references(()=>stores.id,{"onDelete":"cascade"}),
  name: text('name').notNull(),
  description: text('description'),
  pointsCost: integer('points_cost').notNull(),
  type: text('type', { enum: rewardTypes }).notNull(),
  value: integer('value').default(0),
  isActive: boolean('is_active').default(true),
  // how many times this reward was redeemed
  redeemed: integer('redeemed').notNull().default(0),
  minPurchase: integer('min_purchase').notNull().default(0),
  expiryDays: integer('expiry_days').notNull().default(30),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



export const insertRewardSchema = createInsertSchema(rewards, {
  id:z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  value: z.coerce.number().nonnegative(),
  pointsCost:z.coerce.number().nonnegative(),
  minPurchase: z.coerce.number().nonnegative(),
  expiryDays: z.coerce.number().nonnegative(),
  isActive: z.boolean(),
}).pick({
  id:true,
  name: true,
  type: true,
  description: true,
  value: true,
  pointsCost:true,
  minPurchase: true,
  expiryDays: true,
  isActive: true,
});


export const selectRewardSchema = createSelectSchema(rewards);
