import { pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { stores } from "./stores";

export const storeUsers = pgTable("store_users", {
    storeId: uuid("store_id").references(() => stores.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    role: text("role", { enum: ["owner", "manager", "viewer"] }).default("manager"), // e.g., "owner", "manager", "viewer"
    joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => ({
    pk: primaryKey({ columns: [table.storeId, table.userId] }),
}));
