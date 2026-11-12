import { date, pgTable, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";
import { stores } from "./stores";
import { orders } from "./orders";

export const customerCategorySpending = pgTable('customer_category_spending', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id,{"onDelete":"cascade"}).notNull(),
  customerId: uuid('customer_id').references(() => users.id,{"onDelete":"cascade"}).notNull(),
  storeId: uuid('store_id').references(() => stores.id,{"onDelete":"cascade"}).notNull(),
  categoryId: uuid('category_id').references(() => categories.id,{"onDelete":"cascade"}).notNull(),
  amount: real('amount').notNull(),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
