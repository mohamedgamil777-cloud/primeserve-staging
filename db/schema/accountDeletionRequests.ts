// schema/accountDeletionRequests.ts
import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

// const reasons = ["pending","processing","approved","canceled","rejected","completed"] as const
const reasons = ["pending","canceled","completed"] as const
export const accountDeletionRequests = pgTable("account_deletion_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  status: text("status", { enum: reasons })
    .notNull()
    .default("pending"), // pending | processing | approved | rejected | completed
  requestedAt: timestamp("requested_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  //   processedBy: uuid("processed_by").references(() => users.id), // staff/admin who handled it
});
