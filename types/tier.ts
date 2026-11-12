import { selectTierSchema } from "@/db/schema/tiers";
import { z } from "zod";

export type ExistingTier = z.infer<typeof selectTierSchema>
export type TierItem = Omit<ExistingTier,"storeId"|"updatedAt"|"createdAt">


export type TierFilters = {
    query?:string,
}
