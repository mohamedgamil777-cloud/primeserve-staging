import { pgTable, uuid, text, numeric, timestamp, integer, real } from "drizzle-orm/pg-core"
import { users } from "./users"
import { categories } from "./categories"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { stores } from "./stores"

export const budgetPeriods = ["monthly", "yearly", "quarterly", "weekly"] as const

export const customerBudgets = pgTable("customer_budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  period: text("period", { enum: ["monthly", "yearly", "quarterly", "weekly"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})



export const selectCustomerBudgetSchema = createSelectSchema(customerBudgets)
export const insertCustomerBudgetSchema = createInsertSchema(customerBudgets,{
  "id":z.string().optional(),
  "name": z.string().min(1, "Budget name is required"),
}).omit({
  "createdAt":true,
  "updatedAt":true,
  "storeId":true,
  "customerId":true
})