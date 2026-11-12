import { boolean, numeric, pgTable, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const storeTaxSettings = pgTable("store_tax_settings", {
  storeId: uuid("store_id").primaryKey().references(() => stores.id),
  enableTax: boolean("enable_tax").notNull().default(false),
  defaultRate: real("default_rate").notNull().default(0),
  pricesIncludeTax: boolean("prices_include_tax").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})



export const insertStoreTaxSettingsSchema = createInsertSchema(storeTaxSettings,{
  enableTax: z.boolean(),
  defaultRate: z
    .number({
      required_error: "Tax rate is required",
      invalid_type_error: "Tax rate must be a number"
    })
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate must be less than or equal to 100"),
  pricesIncludeTax: z.boolean()
}).pick({
  "defaultRate":true,
  "enableTax":true,
  "pricesIncludeTax":true,
})