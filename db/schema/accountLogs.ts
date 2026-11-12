import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { stores } from "./stores";

export const accountLogs = pgTable("account_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  storeId: uuid("store_id").notNull().references(() => stores.id),
  action: text("action").notNull(), // "password_changed", "2fa_enabled", etc.
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
