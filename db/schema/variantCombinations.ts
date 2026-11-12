import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { products } from "./products";

export const variantCombinations = pgTable("variant_combinations", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    price: integer("price").notNull(),
    stock: integer("stock").notNull(),
    sku: text("sku").notNull(),
    barcode: text("barcode"),
    isActive: boolean("is_active").default(true),
    combination: text("combination").notNull(), // e.g. JSON stringified { RAM: "8 GB", Storage: "128 GB" }
});
