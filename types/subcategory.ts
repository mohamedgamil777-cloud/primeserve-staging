import { z } from "zod";
import { selectSubCategorySchema } from "@/db/schema/subcategories";

export type ExistingSubCategory = z.infer<typeof selectSubCategorySchema>