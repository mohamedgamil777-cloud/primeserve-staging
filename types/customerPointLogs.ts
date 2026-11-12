import { selectCustomerPointLogSchema } from "@/db/schema/customerPointLogs";
import { z } from "zod";
import { PointEarningMethod } from "./pointEarningMethod";
import { ExistingReward } from "./reward";

export type ExistingCustomerPointLog = z.infer<typeof selectCustomerPointLogSchema>
export type CustomerPointLog = Pick<ExistingCustomerPointLog,"id"|"points"|"type"|"createdAt"> & {
    "method"?:Pick<PointEarningMethod,"id"|"name">|null,
    "reward"?:Pick<ExistingReward,"id"|"name">|null
}