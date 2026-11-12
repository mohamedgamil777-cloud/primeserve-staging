import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { stores } from "./stores";

export const wishlists = pgTable("wishlists", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    storeId: uuid("store_id").notNull().references(() => stores.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});