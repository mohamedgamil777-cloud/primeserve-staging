import {
  pgTable,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core"
import { promotionCodes } from "./promotionCodes"
import { stores } from "./stores"
import { users } from "./users"
import { orders } from "./orders"

export const promotionCodeUsages = pgTable("promotion_code_usages", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  promotionCodeId: uuid("promotion_code_id").notNull().references(() => promotionCodes.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => users.id, { onDelete: "set null" }),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "set null" }),
  usedAt: timestamp("used_at").notNull().defaultNow(),
})
