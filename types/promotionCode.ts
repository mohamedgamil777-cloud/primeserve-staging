import { selectPromotionCodeSchema } from "@/db/schema/promotionCodes";
import { z } from "zod";
export const promotionCodeStatuses = ["all","active","scheduled","expired","disabled"] as const
export type PromotionCodeStatus = typeof promotionCodeStatuses[number]

export type PromotionCodeFilters = {
    query?:string,
    status?:PromotionCodeStatus,
}

export type ExistingPromotionCode = z.infer<typeof selectPromotionCodeSchema>
export type PromotionCode = Omit<ExistingPromotionCode,"storeId"|"updatedAt">
export type CustomerPromotionCode = Pick<PromotionCode,"id"|"code"|"value"|"type">