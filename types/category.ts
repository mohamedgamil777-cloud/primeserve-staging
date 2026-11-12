import { z } from "zod";
import { selectCategorySchema } from "@/db/schema/categories";
import { ExistingSubCategory } from "./subcategory";

export type ExistingCategory = z.infer<typeof selectCategorySchema>
export type DetailedCategory = ExistingCategory & {
    "subcategories":ExistingSubCategory[]
}