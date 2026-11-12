import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { wishlists } from "./wishlists";
import { products } from "./products";
import { variantCombinations } from "./variantCombinations";

export const wishlistItems = pgTable("wishlist_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    wishlistId: uuid("wishlist_id").notNull().references(() => wishlists.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id,{ onDelete: "cascade" }),
    variantCombinationId: uuid("variant_combination_id").references(() => variantCombinations.id),
    addedAt: timestamp("added_at").notNull().defaultNow(),
});
