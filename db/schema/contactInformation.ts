import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const contactInformation = pgTable('contact_information', {
  customerServicePhone: text('customer_service_phone'),
  supportEmail: text('support_email'),
  officeAddress: text('office_address'),
  businessHours: text('business_hours'),
  liveChatEnabled: boolean('live_chat_enabled').default(false), // Or use `boolean()` if supported
  contactFormEnabled: boolean('contact_form_enabled').default(false),
  storeId: uuid("store_id").notNull().references(() => stores.id),
  facebook: text("facebook"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  tiktok: text("tiktok"),
  youtube: text("youtube"),
  pinterest: text("pinterest"),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


export const insertStoreContactInfoSchema = createInsertSchema(contactInformation,{
  customerServicePhone: z.string().min(1, "Customer service phone is required"),
  supportEmail: z.string().email("Invalid email address"),
  officeAddress: z.string().min(1, "Office address is required"),
  businessHours: z.string().min(1, "Business hours are required"),
  liveChatEnabled: z.boolean(),
  contactFormEnabled: z.boolean(),
}).pick({
  customerServicePhone: true,
  supportEmail: true,
  officeAddress: true,
  businessHours: true,
  liveChatEnabled: true,
  contactFormEnabled: true,
})

export const insertStoreSocialMediaInfoSchema = createInsertSchema(contactInformation,{
  facebook: z.union([z.literal(""),z.string().url().optional()]),
  twitter: z.union([z.literal(""),z.string().url().optional()]),
  tiktok: z.union([z.literal(""),z.string().url().optional()]),
  youtube: z.union([z.literal(""),z.string().url().optional()]),
  pinterest: z.union([z.literal(""),z.string().url().optional()]),
  instagram: z.union([z.literal(""),z.string().url().optional()]),
}).pick({
  facebook: true,
  twitter: true,
  tiktok: true,
  youtube: true,
  pinterest: true,
  instagram: true,
})



export const selectStoreContactInfoSchema = createSelectSchema(contactInformation).pick({
  customerServicePhone: true,
  supportEmail: true,
  officeAddress: true,
  businessHours: true,
  liveChatEnabled: true,
  contactFormEnabled: true,
})


export const selectSocialMediaInfoSchema = createSelectSchema(contactInformation).pick({
  facebook: true,
  twitter: true,
  tiktok: true,
  youtube: true,
  pinterest: true,
  instagram: true,
})