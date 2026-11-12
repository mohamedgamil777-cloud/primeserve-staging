import { boolean, integer, jsonb, pgTable, real, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { serviceCategories } from "./serviceCategories";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { selectAdditionalServiceOptionSchema } from "./additionalServiceOptions";
import { selectServiceImageSchema } from "./serviceImages";
import { createOptionalTranslatedFieldSchema, createTranslatedFieldSchema, TranslatedText } from "@/types/internationalization";

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  storeId: uuid("store_id").notNull().references(() => stores.id),
  categoryId: uuid("category_id").notNull().references(() => serviceCategories.id),
  pricingModel: text("pricing_model",{"enum":["fixed", "quote"]}),
  slug: varchar("slug", { length: 255 }).notNull(),

  nameI18n: jsonb("name_i18n").$type<TranslatedText>().notNull().default({}),
  shortDescriptionI18n: jsonb("short_description_i18n").$type<TranslatedText>().default({}),
  longDescriptionI18n: jsonb("long_description_i18n").$type<TranslatedText>().default({}),  

  type: varchar("type", { length: 50 }), // e.g., "Installation"
  price: integer("price"),
  features:text()
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  requirements:text()
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  inclusions:text()
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  estimatedDuration: varchar("estimated_duration", { length: 50 }), // e.g., "2-3 hours"
  // Urgency Levels
  standardPriorityFee: integer("standard_priority_fee").notNull().default(0),
  mediumPriorityFee: integer("medium_priority_fee").notNull().default(0),
  highPriorityFee: integer("high_priority_fee").notNull().default(0),
  
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});




export const insertServiceSchema = createInsertSchema(services, {
  id: z.string().optional(),
  // Basic Information
  categoryId: z.string({ required_error: "Please select a category" }),
  type: z.string({ required_error: "Please select a service type" }),
  pricingModel: z.enum(["fixed", "quote"]),
  price: z.number().optional(),
  estimatedDuration: z.string().min(1, { message: "Please provide estimated duration" }),

  nameI18n: createTranslatedFieldSchema(2, "Name"),
  shortDescriptionI18n: createOptionalTranslatedFieldSchema(10, "Short Description"),
  longDescriptionI18n: createOptionalTranslatedFieldSchema(20, "Long Description"),
  
  // What's Included, Features, Requirements
  inclusions: z.array(z.string()).min(1, { message: "Add at least one included item" }),
  features: z.array(z.string()).min(1, { message: "Add at least one feature" }),
  requirements: z.array(z.string()),

  // Urgency Levels
  standardPriorityFee: z.number().min(0, { message: "Standard Priority Fee must be a positive number or Zero" }),
  mediumPriorityFee: z.number().min(0, { message: "Medium priority fee must be a positive number or Zero" }),
  highPriorityFee: z.number().min(0, { message: "High priority fee must be a positive number or Zero" }),

  // Settings
  isActive: z.boolean().default(true),

}).omit({
  "storeId":true,
  "updatedAt":true,
  "createdAt":true,
  "slug":true
}).extend({
  // Additional Services
  additionalServices: z.array(
    selectAdditionalServiceOptionSchema.extend({
      id: z.string().optional(),
      name: z.string().min(1, { message: "Service name is required" }),
      price: z.number().min(0, { message: "Price must be a positive number" }),
    }).omit({
      "serviceId":true,
    })
  ),
  images:z.array(selectServiceImageSchema.omit({"serviceId":true}))
});


export const selectServiceSchema = createSelectSchema(services);
