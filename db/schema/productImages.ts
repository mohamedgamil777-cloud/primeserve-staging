import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { products } from "./products";

export const productImages = pgTable("product_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    url: text("url").notNull(),
    alt: text("alt"),
});
