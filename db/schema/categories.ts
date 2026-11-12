import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { stores } from "./stores";
import { createOptionalTranslatedFieldSchema, createTranslatedFieldSchema, TranslatedText } from "@/types/internationalization";

export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    nameI18n: jsonb("name_i18n").$type<TranslatedText>().notNull().default({"ar":"","en":""}),
    descriptionI18n: jsonb("description_i18n").$type<TranslatedText>().notNull().default({"ar":"","en":""}),
    slug: varchar("slug", { length: 100 }).unique().notNull(), // e.g. "men"
    image: text("image"),
    featured: boolean("featured").default(false),
    storeId: uuid("store_id").references(() => stores.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});





export const insertCategorySchema = createInsertSchema(categories,{
    "id":z.string().optional(),
    "image":z.any().optional(),
    "nameI18n": createTranslatedFieldSchema(3, "Name"),
    "descriptionI18n": createOptionalTranslatedFieldSchema(10, "Description"),
}).omit({
    "slug":true,
    "storeId":true
})
  
export const selectCategorySchema = createSelectSchema(categories);
  