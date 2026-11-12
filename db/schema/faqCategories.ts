import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { insertFAQSchema, selectFAQSchema } from "./faqs";

export const faqCategories = pgTable('faq_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  storeId: uuid("store_id").notNull().references(() => stores.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})




export const selectFAQCategorySchema = createSelectSchema(faqCategories)
export const insertFAQCategorySchema = createInsertSchema(faqCategories,{
  "id":z.string().optional(),
  "name": z.string().min(1, "Category name is required"),
}).omit({
  "createdAt":true,
  "updatedAt":true,
  "storeId":true
})


export const insertFAQCategoryTreeSchema = z.object({
  "categories":z.array(insertFAQCategorySchema.extend({
    "faqs":z.array(insertFAQSchema.omit({"categoryId":true}))
  }))
}) 

export type FAQCategoryTree = Pick<z.infer<typeof selectFAQCategorySchema>,"id"|"name"|"icon"> & {
  "faqs":Pick<z.infer<typeof selectFAQSchema>,"answer"|"id"|"question">[]
}


  