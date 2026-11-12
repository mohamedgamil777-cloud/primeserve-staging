import { selectPointEarningMethodSchema } from "@/db/schema/pointEarningMethods";
import { z } from "zod";

export type ExistingPointEarningMethod = z.infer<typeof selectPointEarningMethodSchema>
export type PointEarningMethod = Omit<ExistingPointEarningMethod,"storeId"|"updatedAt"|"createdAt">


export type PointEarningMethodFilters = {
    query?:string,
}
