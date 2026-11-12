// drizzle/schema/storeEmailPreferences.ts
import {
  pgTable,
  uuid,
  boolean,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { stores } from './stores'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const storeEmailPreferences = pgTable('store_email_preferences', {
  // id: uuid('id').defaultRandom().primaryKey(),

  storeId: uuid('store_id')
    .notNull()
    .references(() => stores.id, { onDelete: 'cascade' })
    .primaryKey(),
  // Email provider API key (e.g., Resend)
  resendApiKey: text('resend_api_key'),

  // Admin Notification preferences
  notifyOnNewOrder: boolean('notify_on_new_order').default(true).notNull(),
  notifyOnServiceRequest: boolean('notify_on_service_request').default(true).notNull(),
  // notify admin when there is a status change caused by the customer (ex: order canclled)
  notifyOnOrderStatusChange: boolean('notify_on_order_status_change').default(true).notNull(),
  notifyOnServiceStatusChange: boolean('notify_on_service_status_change').default(true).notNull(),
  notifyOnCustomerMessage: boolean('notify_on_customer_message').default(true).notNull(),

  // customer emails for admin notifications
  orderNotificationEmail: text("order_notification_email"),
  serviceNotificationEmail: text("service_notification_email"),
  customerMessageNotificationEmail: text("customer_message_notification_email"),

  // Customer Notification preferences
  notifyCustomerOnServiceStatusChange: boolean('notify_customer_on_service_status_change').default(true).notNull(),
  notifyCustomerOnOrderStatusChange: boolean('notify_customer_on_order_status_change').default(true).notNull(),

  // Support features
  supportPasswordReset: boolean('support_password_reset').default(true).notNull(),
  supportEmailVerification: boolean('support_email_verification').default(true).notNull(),
  supportPromotionalEmails: boolean('support_promotional_emails').default(false).notNull(),

  // Optional from/email sender configuration
  fromEmail: text('from_email'),
  replyToEmail: text('reply_to_email'),
  emailSenderName: text('email_sender_name'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const insertStoreEmailPreferencesSchema = createInsertSchema(storeEmailPreferences,{
  resendApiKey: z.string().min(10, "API key must be at least 10 characters"),
  notifyOnNewOrder: z.boolean(),
  notifyOnServiceRequest: z.boolean(),
  notifyOnOrderStatusChange: z.boolean(),
  notifyOnServiceStatusChange: z.boolean(),
  notifyOnCustomerMessage: z.boolean(),
  orderNotificationEmail: z.string().email("Invalid email address").optional(),
  serviceNotificationEmail: z.string().email("Invalid email address").optional(),
  customerMessageNotificationEmail: z.string().email("Invalid email address").optional(),
  notifyCustomerOnServiceStatusChange: z.boolean(),
  notifyCustomerOnOrderStatusChange: z.boolean(),
  supportPasswordReset: z.boolean(),
  supportEmailVerification: z.boolean(),
  supportPromotionalEmails: z.boolean(),
  fromEmail: z.string().email("Invalid email address").optional(),
  replyToEmail: z.string().email("Invalid email address").optional(),
  emailSenderName: z.string().min(2, "Sender name must be at least 2 characters").optional(),
})
export const selectStoreEmailPreferencesSchema = createSelectSchema(storeEmailPreferences)
