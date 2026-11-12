import { boolean, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { z } from "zod";

export const storePaymentMethods = pgTable("store_payment_methods", {
  storeId: uuid("store_id").notNull().references(() => stores.id),
  method: text("method",{"enum":["cash","credit_card", "paypal", "apple_pay", "google_pay"]}).notNull(),
  enabled: boolean("enabled").default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.storeId, t.method] })
}))


export const paymentMethodsFormSchema = z.object({
  cash: z.boolean(),
  creditCard: z.boolean(),
  paypal: z.boolean(),
  applePay: z.boolean(),
  googlePay: z.boolean()
}).refine(args=>Object.values(args).some(i=>i),{"message":"You need at least one payment method enabled.","path":["cash"]})