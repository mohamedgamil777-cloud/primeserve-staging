import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const storeDisplaySettings = pgTable("store_display_settings", {
  storeId: uuid("store_id").primaryKey().references(() => stores.id),

  cartStyle: text("cart_style",{"enum":["grid","card"]}).notNull().default("card"),
  productStyle: text("product_style",{"enum":["simple","detailed"]}).notNull().default("simple"),
  serviceStyle: text("service_style",{"enum":["simple","detailed"]}).notNull().default("simple"),
  categoryStyle: text("category_style",{"enum":["simple","detailed"]}).notNull().default("simple"),
  showFeaturedProducts: boolean("show_featured_products").notNull().default(true),

  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});



export const insertStoreDisplaySettingsSchema = createInsertSchema(storeDisplaySettings).omit({
  "updatedAt":true,
  "storeId":true,
})

export const selectStoreDisplaySettingsSchema = createSelectSchema(storeDisplaySettings);
  