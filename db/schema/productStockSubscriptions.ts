import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./users";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const productStockSubscriptions = pgTable("product_stock_subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "set null" }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    notifyBy: varchar("notify_by", { enum: ["email", "sms"] }).notNull(),
    notified: boolean("notified").default(false),
    addToCart: boolean("add_to_cart").default(false),
    storeId: uuid("store_id")
        .notNull()
        .references(() => stores.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});




export const insertProductStockSubscriptionSchema = createInsertSchema(productStockSubscriptions)
    .omit({
        "createdAt":true,
        "updatedAt":true,
        "storeId":true,
        "id":true,
        "userId":true,
        "notified":true
    }
)
  
export const selectProductStockSubscriptionSchema = createSelectSchema(productStockSubscriptions);
  