import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { users } from "./users";
import { services } from "./services";
import { addresses } from "./addresses";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";


export const serviceTimeLines = {
  'asap':'ASAP',
  '1-week':'Within 1 week',
  '2-weeks':'Within 2 weeks',
  '1-month':'Within 1 month',
  '3-months':'Within 3 months',
  'flexible':'Flexible',
} as const

export const serviceBudgets = {
  'under-1k':'Under $1,000',
  '1k-5k':'$1,000 - $5,000',
  '5k-10k':'$5,000 - $10,000',
  '10k-25k':'$10,000 - $25,000',
  '25k-50k':'$25,000 - $50,000',
  'over-50k':'Over $50,000',
  'not-sure':'Not Sure'
} as const

export const serviceRequestUrgencies = ["low","medium","high"] as const
export const serviceRequestStatuses = ["pending", "confirmed", "in progress", "canceled", "completed"] as const

export const serviceRequests = pgTable("service_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").notNull().references(() => stores.id),
  userId: uuid("user_id").notNull().references(() => users.id), // nullable if guest
  addressId: uuid("address_id").notNull().references(() => addresses.id),
  serviceId: uuid("service_id").notNull().references(() => services.id),
  addtionalServiceIds: uuid("additional_service_ids").array().notNull().default(sql`'{}'::uuid[]`),
    
  timeline: text("timeline",{"enum":['asap','1-week','2-weeks','1-month','3-months','flexible']}).notNull(),
  desiredDaytime: text("desired_day_time",{"enum":['morning', 'afternoon', 'evening', 'anytime']}).notNull(),
  status: text("status", { enum: serviceRequestStatuses }).notNull().default("pending"),
  urgency: text("urgency", { enum: serviceRequestUrgencies }).notNull(),
  description: text("description"),

  budget: text("budget",{"enum":['under-1k','1k-5k','5k-10k','10k-25k','25k-50k','over-50k','not-sure']}).notNull(),
  contactMethod: text("contact_method",{"enum":['email', 'phone', 'both']}).notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});



export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  "id":true,
  "userId":true,
  "storeId":true,
  "updatedAt":true,
  "createdAt":true,
});


export const selectServiceRequestSchema = createSelectSchema(serviceRequests);
