import { uuid, integer, real, boolean, timestamp, pgTable } from "drizzle-orm/pg-core"
import { stores } from "./stores"
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const storeCartSettings = pgTable("store_cart_settings", {
  storeId: uuid("store_id").primaryKey().references(() => stores.id, { onDelete: "cascade" }),
  // Order Constraints
  minPurchaseAmount: real("min_purchase_amount").default(0),
  maxPurchaseAmount: real("max_purchase_amount"),

  minItemsPerOrder: integer("min_items_per_order").default(100),
  maxItemsPerOrder: integer("max_items_per_order").default(100),

  // Reward & promotion Settings (optional)
  rewardEnabled: boolean("reward_enabled").default(true),
  promotionEnabled: boolean("promotion_enabled").default(true),

  updatedAt: timestamp("updated_at").defaultNow(),
})



export const insertStoreCartSettingsSchema = createInsertSchema(storeCartSettings).omit({
  "updatedAt":true,
  "storeId":true,
})

export const selectStoreCartSettingsSchema = createSelectSchema(storeCartSettings);
  
export type StoreCartSettings = Omit<z.infer<typeof selectStoreCartSettingsSchema>,"updatedAt"|"storeId">
