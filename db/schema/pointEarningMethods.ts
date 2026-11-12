import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const pointEarningMethodTypes = ['purchase', 'review', 'signup', 'referral', 'birthday', 'social'] as const
export const pointEarningMethodFrequencies = [
  'once',
  'daily',
  'weekly',
  'monthly',
  'unlimited',
] as const

export const pointEarningMethods = pgTable('point_earning_methods', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(()=>stores.id,{"onDelete":"cascade"}),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: pointEarningMethodTypes }).notNull(),
  totalEarned: integer('total_earned').notNull().default(0),
  totalPointsEarned: integer('total_points_earned').notNull().default(0),
  pointsAwarded: integer('points_awarded').notNull().default(0),
  pointsPerDollar: integer('points_per_dollar').notNull().default(0),
  frequency: text('frequency',{"enum":pointEarningMethodFrequencies}),
  conditions: text('conditions'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),  
});



export const insertPointEarningMethodSchema = createInsertSchema(pointEarningMethods, {
  id:z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  pointsAwarded: z.coerce.number().nonnegative(),
  description: z.string().optional(),
  conditions: z.string().optional(),
  pointsPerDollar: z.coerce.number().nonnegative(),
  isActive: z.boolean(),
}).pick({
  id:true,
  name: true,
  description: true,
  isActive: true,
  type: true,
  frequency:true,

  pointsAwarded: true,
  conditions: true,
  pointsPerDollar: true,


});


export const selectPointEarningMethodSchema = createSelectSchema(pointEarningMethods);