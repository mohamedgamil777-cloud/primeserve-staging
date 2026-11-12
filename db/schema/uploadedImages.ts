import { customType, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
    dataType() {
        return "bytea";
    },
});

// Images uploaded from the admin panel when the site runs on a host with a
// read-only disk (Vercel). Locally, uploads are still written to public/imgs.
export const uploadedImages = pgTable("uploaded_images", {
    section: text("section").notNull(),
    name: text("name").notNull(),
    data: bytea("data").notNull(),
    contentType: text("content_type").notNull().default("image/webp"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.section, t.name] })]);
