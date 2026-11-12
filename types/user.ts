import { selectUserSchema } from "@/db/schema/users"
import { z } from "zod"
import { ExistingStore } from "./store"

export type ExistingUser = z.infer<typeof selectUserSchema>
export type CurrentUser = Pick<ExistingUser,"id"|"firstName"|"lastName"|"img"|"role"> & {
    "stores":Pick<ExistingStore,"image"|"id"|"name"|"slug">[]
}



export const accountDeletionSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  customReason: z.string().optional(),
}).refine(
  (data) => data.reason !== "other" || data.customReason?.trim().length,
  {
    message: "Please provide a custom reason",
    path: ["customReason"],
  }
)