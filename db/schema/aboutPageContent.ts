import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core'
import { stores } from './stores'
import { z } from 'zod'
import { createInsertSchema } from 'drizzle-zod'

export const aboutPageContent = pgTable('about_page_content', {
  storeId: uuid('store_id').references(() => stores.id).notNull().unique(),
  heroTitle: text('hero_title').notNull().default(""),
  heroDescription: text('hero_description').notNull().default(""),
  mission: text('mission').notNull().default(""),
  vision: text('vision').notNull().default(""),
  values: text('values').notNull().default(""),
  yearsInBusiness: text('years_in_business').notNull().default(""),
  happyCustomers: text('happy_customers').notNull().default(""),
  productsAvailable: text('products_available').notNull().default(""),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})


export const aboutPageContentFormSchema = createInsertSchema(aboutPageContent,{
  heroTitle: z.string().min(1, "Hero title is required"),
  heroDescription: z.string().min(1, "Hero description is required"),
  yearsInBusiness: z.string().min(1, "Years in business is required"),
  happyCustomers: z.string().min(1, "Happy customers is required"),
  productsAvailable: z.string().min(1, "Products available is required"),
  mission: z.string().min(1, "Mission is required"),
  vision: z.string().min(1, "Vision is required"),
  values: z.string().min(1, "Values are required"),
}).pick({
  heroTitle: true,
  heroDescription: true,
  yearsInBusiness: true,
  happyCustomers: true,
  productsAvailable: true,
  mission: true,
  vision: true,
  values: true,
})