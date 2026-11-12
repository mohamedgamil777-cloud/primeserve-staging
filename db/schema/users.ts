import { pgTable, varchar, timestamp, uuid, text, boolean, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { stores } from "./stores";


export const userRoles = ["customer", "seller", "sass-admin"] as const
export type UserRole = typeof userRoles[number]

export const genders = ["Male","Female"] as const
export type Gender = typeof genders[number] 

// Users Table (Doctors, Patients, Admins)
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 25 }).notNull().default(""),
    lastName: varchar("last_name", { length: 255 }).notNull().default(""),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: text("role",{enum:userRoles}).notNull(),
    phone: varchar("phone", { length: 20 }),
    storeId: uuid("store_id").references(() => stores.id), // null for sass-admin
    // publicPhones: text("public_phones").array()    
    //     .notNull()
    //     .default(sql`'{}'::text[]`),
    img: text("profile_photo"),
    customerNotes: text("customer_notes"),
    twoFactorEnabled: boolean("two_factor_enabled").default(false),
    
    verified: boolean("verified").notNull().default(false),
    verificationToken: varchar('verification_token', { length: 6 }),
    verificationTokenExpires: timestamp('verification_token_expires'),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
},(table) => ({
    uniqueEmailPerTenant: unique().on(table.email, table.storeId),
}));

export const updateUserSchema = createInsertSchema(users,{
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.union([
        z.null(),
        z.literal(""),
        z
            .string()
            .min(6, { message: "Phone number must be at least 6 characters" })
            .max(20, { message: "Phone number must be at most 20 characters" })
            .regex(
                /^[\d\s\-()+]+$/,
                { message: "Phone number must contain only numbers and allowed characters (+, -, space, parentheses)" }
            ),
    ]).optional(),
}).pick({
    "firstName":true,
    "lastName":true,
    "email":true,
    "phone":true
})

export const insertUserSchema = createInsertSchema(users,{
    "id":z.string().optional(),
}).omit({
    "createdAt":true,
    // "publicPhones":true,
}).extend({
    confirmPassword: z.string().min(8, "Please confirm your password"),
    // termsAccepted: z.literal(true, {
    //     errorMap: () => ({ message: "You must accept the terms and conditions" }),
    // }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export const insertUserMoreSecureSchema = createInsertSchema(users,{
    "id":z.string().optional(),
}).omit({
    "createdAt":true,
    // "publicPhones":true,
}).extend({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
  
export const selectUserSchema = createSelectSchema(users);
  

