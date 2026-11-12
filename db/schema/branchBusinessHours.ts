import { boolean, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";
import { storeBranches } from "./storeBranches";

export const branchBusinessHours = pgTable('branch_business_hours', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').references(() => storeBranches.id).notNull(),

  dayOfWeek: text('day_of_week').notNull(), // e.g. 'Monday', 'Tuesday'
  isOpen: boolean('is_open').notNull().default(false),
  openTime: time('open_time'),
  closeTime: time('close_time'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});