import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { variantTypes } from "./variantTypes";

export const variantOptions = pgTable("variant_options", {
    id: uuid("id").primaryKey().defaultRandom(),
    variantTypeId: uuid("variant_type_id").references(() => variantTypes.id).notNull(),
    value: text("value").notNull(), // e.g., "8 GB"
});
