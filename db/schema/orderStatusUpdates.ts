import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { ORDER_STATUSES, orders } from "./orders"
import { stores } from "./stores"

export const orderStatusUpdates = pgTable("order_status_updates", {
  id: uuid("id").defaultRandom().primaryKey(),

  storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),

  status: text("status",{enum:ORDER_STATUSES}).notNull(), // e.g. "order_placed", "shipped"
  note: text("note"),
  noteForCustomer: text("note_for_customer"),
  date: timestamp("date").notNull().defaultNow(), // e.g. new Date()
})
