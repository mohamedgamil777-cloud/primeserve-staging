import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { services } from "./services";
import { createSelectSchema } from "drizzle-zod";

export const additionalServiceOptions = pgTable("additional_service_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
});


export const selectAdditionalServiceOptionSchema = createSelectSchema(additionalServiceOptions);
