// schema/userPreferences.ts
import { pgTable, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  // Email preferences
  orderUpdates: boolean("order_updates").notNull().default(true),
  promotions: boolean("promotions").notNull().default(true),
  newsletter: boolean("newsletter").notNull().default(true),
  recommendations: boolean("recommendations").notNull().default(true),

  // Privacy settings
  profileVisible: boolean("profile_visible").notNull().default(true),
  orderHistoryVisible: boolean("order_history_visible").notNull().default(true),
  reviewsVisible: boolean("reviews_visible").notNull().default(true),
  wishlistVisible: boolean("wishlist_visible").notNull().default(true),

  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});






export const insertUserPreferencesSchema = createInsertSchema(userPreferences);
export const insertUserEmailPreferencesSchema = createInsertSchema(userPreferences).pick({
    "newsletter":true,
    "recommendations":true,
    "promotions":true,
    "orderUpdates":true
});

export const insertUserPrivacyPreferencesSchema = createInsertSchema(userPreferences).pick({
    "orderHistoryVisible":true,
    "profileVisible":true,
    "reviewsVisible":true,
    "wishlistVisible":true
});


export const selectUserPreferencesSchema = createSelectSchema(userPreferences);
  