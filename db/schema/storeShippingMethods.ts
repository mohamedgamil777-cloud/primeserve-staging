import { boolean, numeric, pgTable, primaryKey, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { z } from "zod";

export const storeShippingMethods = pgTable("store_shipping_methods", {
  storeId: uuid("store_id").notNull().references(() => stores.id),
  method: text("method",{"enum":["standard", "express", "free", "international"]}).notNull(),
  enabled: boolean("enabled").default(false),
  price: real("price").default(0),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.storeId, t.method] })
}))


export const shippingSchema = z.object({
  standard: z.object({
    enabled: z.boolean(),
    cost: z.number().min(0, "Shipping cost cannot be negative"),
  }),
  express: z.object({
    enabled: z.boolean(),
    cost: z.number().min(0, "Shipping cost cannot be negative"),
  }),
  free: z.object({
    enabled: z.boolean(),
    cost: z.number().min(0, "Shipping cost cannot be negative"),
  }),
  international: z.object({
    enabled: z.boolean(),
    cost: z.number().min(0, "Shipping cost cannot be negative"),
  }),
}).refine(args=>Object.values(args).some(i=>i.enabled),{"message":"You need at least one shipping method enabled.","path":["free","standard","express","international"]})
