import { pgTable, text, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const supportedCountries = ["Egypt"] as const
export type SupportedCountry = typeof supportedCountries[number]

export const addresses = pgTable('addresses', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    storeId: uuid('store_id').notNull().references(() => stores.id),
    name: text('name').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    address: text('address').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    zipCode: text('zip_code').notNull(),
    country: text('country',{"enum":supportedCountries}).notNull(),
    phone: text('phone').notNull(),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),    
});

export const selectAddressSchema = createSelectSchema(addresses);
export const updateAddressSchema = createInsertSchema(addresses,{
    "id":z.string().optional(),
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name must be at most 50 characters" }),

    firstName: z
        .string()
        .min(1, { message: "First name is required" })
        .max(50, { message: "First name must be at most 50 characters" }),

    lastName: z
        .string()
        .min(1, { message: "Last name is required" })
        .max(50, { message: "Last name must be at most 50 characters" }),

    address: z
        .string()
        .min(5, { message: "Street address must be at least 5 characters" })
        .max(100, { message: "Street address must be at most 100 characters" }),

    city: z
        .string()
        .min(2, { message: "City name must be at least 2 characters" }),

    state: z
        .string()
        .min(2, { message: "State/Province must be at least 2 characters" }),

    zipCode: z
        .string()
        .regex(/^\d{4,10}$/, { message: "ZIP code must be 4-10 digits" }),

    country: z
        .enum(supportedCountries),

    phone: z
        .string()
        .min(6, { message: "Phone number must be at least 6 characters" })
        .max(20, { message: "Phone number must be at most 20 characters" })
        .regex(
            /^[\d\s\-()+]+$/,
            { message: "Phone number must contain only numbers and allowed characters (+, -, space, parentheses)" }
        ),

    isDefault: z.boolean().optional()
}).omit({
    "userId":true,
    "createdAt":true,
    "storeId":true,
    "updatedAt":true
});
