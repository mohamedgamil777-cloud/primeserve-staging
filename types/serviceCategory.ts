import { z } from "zod";
import { selectServiceCategorySchema } from "@/db/schema/serviceCategories";

export type ExistingServiceCategory = Omit<z.infer<typeof selectServiceCategorySchema>,"updatedAt"|"storeId">
export type DetailedServiceCategory = ExistingServiceCategory & {
    "servicesCount":number
}