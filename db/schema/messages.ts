import { pgTable, text, varchar, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { stores } from './stores'
import { z } from 'zod'

// Enums
export const messageStatus = ['unread', 'read', 'responded', 'archived'] as const
export const messagePriority = ['low', 'medium', 'high'] as const
export const messageCategory = ['general', 'order', 'returns', 'technical', 'billing', 'service', 'sales', 'support', 'feedback'] as const

export const messageStatusLabels = {
  "unread":"Unread",
  "read":"Read",
  "responded":"Responded",
  "archived":"Archived",
}

export const messagePriorityLabels = {
  "low":"Low",
  "medium":"Medium",
  "high":"High",
}

export const messageCategoryLabels = {
  "general":"General Inquiry",
  "order":"Order Support",
  "returns":"Returns & Exchanges",
  "support":"General Support",
  "technical":"Technical Support",
  "service":"Services Related",
  "billing":"Billing Questions",
  "sales":"Sales Questions",
  "feedback":"Feedback & Suggestions",
}

export const messageStatusColors = {
  unread: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-800",
  responded: "bg-green-100 text-green-800",
  archived: "bg-purple-100 text-purple-800",
}

export const messagePriorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}


export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(()=>users.id),
  storeId: uuid('store_id').notNull().references(()=>stores.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),

  subject: varchar('subject', { length: 255 }).notNull(),
  category: text('category', { enum: messageCategory }).notNull(),
  message: text('message').notNull(),

  status: text('status', { enum: messageStatus }).notNull().default('unread'),
  priority: text('priority', { enum: messagePriority }).notNull().default('medium'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),

  isStarred: boolean('is_starred').notNull().default(false),
  adminNotes: text('admin_notes').notNull().default(''),
  responseCount: integer('response_count').notNull().default(0),
})


export const insertContactMessageSchema = createInsertSchema(messages,{
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),

})
export const selectContactMessageSchema = createSelectSchema(messages)