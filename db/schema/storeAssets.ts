import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createTranslatedFieldSchema, TranslatedText } from "@/types/internationalization";

export const storeAssets = pgTable('store_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => stores.id).notNull().unique(),

  lightLogoUrl: text('light_logo_url'),
  darkLogoUrl: text('dark_logo_url'),
  faviconUrl: text('favicon_url'),
  
  //TODO: to be removed
  heroTitle: text('hero_title').notNull().default("Optimize your Procurement Spend"),
  heroDescription: text('hero_description').notNull().default("Discover our latest advisory, services, and supplies tailored for your bussiness."),
  heroMainButtonText: text('hero_main_button_text').notNull().default("Shop Now"),
  heroSecondaryButtonText: text('hero_secondary_button_text').notNull().default("Explore Categories"),
  ///////
  heroTitleI18n: jsonb("hero_title_i18n").$type<TranslatedText>().notNull().default({"ar":"Optimize your Procurement Spend","en":"Optimize your Procurement Spend"}),
  heroDescriptionI18n: jsonb("hero_description_i18n").$type<TranslatedText>().notNull().default({"ar":"Discover our latest advisory, services, and supplies tailored for your bussiness.","en":"Discover our latest advisory, services, and supplies tailored for your bussiness."}),
  heroMainButtonTextI18n: jsonb("hero_main_button_text_i18n").$type<TranslatedText>().notNull().default({"ar":"Shop Now","en":"Shop Now"}),
  heroSecondaryButtonTextI18n: jsonb("hero_secondary_button_text_i18n").$type<TranslatedText>().notNull().default({"ar":"Explore Categories","en":"Explore Categories"}),
  
  
  heroMainButtonLink: text('hero_main_button_link').notNull().default("/products"),
  heroSecondaryButtonLink: text('hero_secondary_button_link').notNull().default("/categories"),
  heroBackgroundImage: text('hero_background_image'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const insertStoreAssetsSchema = createInsertSchema(storeAssets,{
  heroTitleI18n: createTranslatedFieldSchema(10, "Hero Title"),
  heroDescriptionI18n: createTranslatedFieldSchema(10, "Hero Description"),
  heroMainButtonTextI18n: createTranslatedFieldSchema(2, "Main Button Text"),
  heroSecondaryButtonTextI18n: createTranslatedFieldSchema(2, "Secondary Button Text"),

  heroBackgroundImage: z.any().optional(), // can add custom validation if needed
  heroMainButtonLink: z.string().min(1,"Must be a valid URL or path"),
  heroSecondaryButtonLink: z.string().min(1,"Must be a valid URL or path")
})

export const heroSectionUpdateSchema = insertStoreAssetsSchema.pick({
  heroTitleI18n: true,
  heroDescriptionI18n: true,
  heroMainButtonTextI18n: true,
  heroSecondaryButtonTextI18n: true,

  heroBackgroundImage: true,
  heroMainButtonLink: true,
  heroSecondaryButtonLink: true
})


export const selectHeroSectionDataSchema = createSelectSchema(storeAssets).pick({
  heroTitleI18n: true,
  heroDescriptionI18n: true,
  heroMainButtonTextI18n: true,
  heroSecondaryButtonTextI18n: true,

  heroBackgroundImage: true,
  heroMainButtonLink: true,
  heroSecondaryButtonLink: true,

  //TODO: remove later
  heroTitle: true,
  heroDescription: true,
  heroMainButtonText: true,
  heroSecondaryButtonText: true,
})