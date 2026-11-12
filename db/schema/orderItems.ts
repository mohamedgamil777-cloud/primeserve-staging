import { integer, jsonb, numeric, pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { products } from "./products";
import { variantCombinations } from "./variantCombinations";
import { TranslatedText } from "@/types/internationalization";

export const orderItems = pgTable('order_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').references(() => products.id,{"onDelete":"set null"}),
    variantCombinationId: uuid('variant_combination_id').references(() => variantCombinations.id),
    quantity: integer('quantity').notNull(),
    //historical data
    price: real('price').notNull(),
    nameI18n: jsonb("name_i18n").$type<TranslatedText>().notNull().default({}),
    mainImage: text("main_image").notNull().default(""),
});