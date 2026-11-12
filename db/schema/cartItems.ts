import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { carts } from "./carts";
import { products } from "./products";
import { variantCombinations } from "./variantCombinations";
import { createSelectSchema } from "drizzle-zod";

export const cartItems = pgTable("cart_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id,{ onDelete: "cascade" }),
    variantCombinationId: uuid("variant_combination_id").references(() => variantCombinations.id),
    quantity: integer("quantity").notNull(),
    addedAt: timestamp("added_at").defaultNow(),
});

  
export const selectCartItemSchema = createSelectSchema(cartItems);
  