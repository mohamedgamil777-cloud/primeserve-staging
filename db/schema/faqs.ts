import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { faqCategories } from "./faqCategories";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const faqs = pgTable('faqs', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => faqCategories.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  storeId: uuid("store_id").notNull().references(() => stores.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),  
})



export const selectFAQSchema = createSelectSchema(faqs)
export const insertFAQSchema = createInsertSchema(faqs,{
  "id":z.string().optional(),
  "question": z.string().min(1, "Question is required"),
  "answer": z.string().min(1, "Answer is required"),
}).omit({
  "createdAt":true,
  "updatedAt":true,
  "storeId":true
})
  