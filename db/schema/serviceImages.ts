import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { services } from "./services";
import { createSelectSchema } from "drizzle-zod";

export const serviceImages = pgTable("service_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id",).notNull().references(() => services.id, { onDelete: "cascade" }),
  src: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});



export const selectServiceImageSchema = createSelectSchema(serviceImages);
