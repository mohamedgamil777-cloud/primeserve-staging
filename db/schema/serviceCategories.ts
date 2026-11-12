import { boolean, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createOptionalTranslatedFieldSchema, createTranslatedFieldSchema, TranslatedText } from "@/types/internationalization";

export const serviceCategories = pgTable("service_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).unique().notNull(), // e.g. "men"
  storeId: uuid("store_id").notNull().references(() => stores.id),
  nameI18n: jsonb("name_i18n").$type<TranslatedText>().notNull().default({}),
  descriptionI18n: jsonb("description_i18n").$type<TranslatedText>().default({}),
  longDescriptionI18n: jsonb("long_description_i18n").$type<TranslatedText>().default({}),  
  image: text("image"),
  icon: varchar("icon", { length: 50 }), // e.g., "Tv", "Smartphone"
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});


export const insertServiceCategorySchema = createInsertSchema(serviceCategories, {
  id: z.string().optional(),
  nameI18n: createTranslatedFieldSchema(2, "Name"),
  descriptionI18n: createOptionalTranslatedFieldSchema(10, "Description"),
  longDescriptionI18n: createOptionalTranslatedFieldSchema(10, "Long Description"),
  icon: z
    .string()
    .max(50, 'Icon name is too long'),
}).omit({
  "storeId":true,
  "updatedAt":true,
  "createdAt":true,
  "slug":true
}).extend({
  image:z.any()
});


export const selectServiceCategorySchema = createSelectSchema(serviceCategories);
