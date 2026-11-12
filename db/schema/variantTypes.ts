import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { products } from "./products";

export const variantTypes = pgTable("variant_types", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    name: text("name").notNull(), // e.g., RAM
});
