import { selectCustomerRewardRedemptionsSchema } from "@/db/schema/customerRedemptions";
import { selectRewardSchema } from "@/db/schema/rewards";
import { z } from "zod";
import { ExistingOrder } from "./order";

export type ExistingReward = z.infer<typeof selectRewardSchema>
export type RewardItem = Omit<ExistingReward,"storeId"|"updatedAt"|"createdAt">


export type RewardFilters = {
    query?:string,
}

export type ExistingRedeemedReward = z.infer<typeof selectCustomerRewardRedemptionsSchema>
export type RedeemedRewardItem = Pick<ExistingRedeemedReward,"id"|"used"|"redeemedAt"|"expiresAt"> & {
    "reward":Pick<ExistingReward,"id"|"name"|"description"|"pointsCost"|"minPurchase"|"type"|"value">|null,
    "order":Pick<ExistingOrder,"code"|"createdAt">|null
}

export type RedeemedRewardFilters = {
    query?:string,
    forCart?:string,
}