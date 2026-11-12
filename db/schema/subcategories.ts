import { integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createOptionalTranslatedFieldSchema, createTranslatedFieldSchema, TranslatedText } from "@/types/internationalization";

export const subcategories = pgTable("subcategories", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => categories.id).notNull(),
    nameI18n: jsonb("name_i18n").$type<TranslatedText>().notNull().default({"ar":"","en":""}),
    descriptionI18n: jsonb("description_i18n").$type<TranslatedText>().notNull().default({"ar":"","en":""}),
    image: text("image"),
    productCount: integer("product_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    
});

export const insertSubCategorySchema = createInsertSchema(subcategories,{
    "id":z.string().optional(),
    "image":z.any().optional(),
    "nameI18n": createTranslatedFieldSchema(3, "Name"),
    "descriptionI18n": createOptionalTranslatedFieldSchema(10, "Description"),    
}).omit({
    "createdAt":true,
    "productCount":true,
})

export const selectSubCategorySchema = createSelectSchema(subcategories);
