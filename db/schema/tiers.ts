import { boolean, integer, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const tiers = pgTable('tiers', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(()=>stores.id,{"onDelete":"cascade"}),
  name: text('name').notNull(),
  color: text('color').notNull(),
  memberCount: integer('member_count').notNull().default(0),
  minPoints: integer('min_points').notNull(),
  maxPoints: integer('max_points'),
  description: text('description'),
  benefits: text("benefits").array()    
    .notNull()
    .default(sql`'{}'::text[]`),
  pointsMultiplier: real('points_multiplier').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



export const insertTierSchema = createInsertSchema(tiers, {
  id:z.string().optional(),
  name: z.string().min(1, 'Name is required'),

  color: z.string().min(1, 'Tier color is required'),
  minPoints: z.coerce.number().nonnegative(),
  maxPoints: z.coerce.number().nonnegative(),
  description: z.string().optional(),
  benefits: z.string().optional(),
  pointsMultiplier: z.coerce.number().nonnegative(),

  isActive: z.boolean(),
}).pick({
  id:true,
  name: true,
  description: true,
  isActive: true,

  color: true,
  minPoints: true,
  maxPoints: true,
  benefits: true,
  pointsMultiplier: true,


});


export const selectTierSchema = createSelectSchema(tiers);