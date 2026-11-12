import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  bio: text('bio'),
  image: text('image').notNull(), // URL or file path

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


export const insertTeamMemberSchema = createInsertSchema(teamMembers,{
  "id":z.string().optional(),
  "image":z.any().optional(),
  "name":z.string().min(3),
}).pick({
  "id":true,
  "image":true,
  "name":true,
  "role": true,
  "bio": true,
})

export const teamMembersSchema = z.object({
  members: z.array(insertTeamMemberSchema),
})
  
export const selectTeamMemberSchema = createSelectSchema(teamMembers);
  