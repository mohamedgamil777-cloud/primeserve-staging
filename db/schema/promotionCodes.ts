import {
  uuid,
  pgTable,
  text,
  integer,
  real,
  index,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"
import { stores } from "./stores"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const promotionCodeTypes = ["percentage", "fixed", "shipping"] as const
export const promotionCodes = pgTable("promotion_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),

  code: text("code").notNull(), // not unique globally
  type: text("type", { enum: promotionCodeTypes }).notNull(),

  value: real("value"), // nullable for free shipping
  description: text("description"),
  minPurchase: real("min_purchase"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0), // track how many times it's used

  startDate: timestamp("start_date",),
  endDate: timestamp("end_date",),

  isActive: boolean("is_active",).default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},
(table) => ({
  storeIdx: index("promotion_store_idx").on(table.storeId),
  storeCodeUnique: index("promotion_code_unique_idx").on(table.storeId, table.code),
}))





export const insertPromotionCodeSchema = createInsertSchema(promotionCodes,{
  "id":z.string().optional(),
  "code": z.string().min(3),
  }).omit({
  "createdAt":true,
  "storeId":true,
  "updatedAt": true,
})
  
export const selectPromotionCodeSchema = createSelectSchema(promotionCodes);
  