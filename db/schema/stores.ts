import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const stores = pgTable("stores", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).unique().notNull(),
    image: text("image"),
    subdomain: varchar("subdomain", { length: 100 }).unique().notNull(), // e.g. "store1"
    customDomain: varchar("custom_domain", { length: 255 }).unique(), 
    storeCurrency: text('store_currency',{"enum":["egp","usd"]}).notNull().default('egp'),
    description: text('description'),
    legalName: text('legal_name'),
    taxId: text('tax_id'),
    gaId: text('ga_id'),
    updatedAt: timestamp("updated_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
});



export const insertStoreSchema = createInsertSchema(stores,{
    "id":z.string().optional(),
})
  
export const selectStoreSchema = createSelectSchema(stores);
  

export const updateStoreInfoSchema = insertStoreSchema.pick({
    name: true,
    storeCurrency: true,
    description: true,
    legalName: true,
    taxId: true,
    gaId:true,
}).extend({
    name: z.string().min(1, "Store name is required"),
})