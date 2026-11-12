import { selectCustomerBudgetSchema } from "@/db/schema/customerBudgets";
import { z } from "zod";

export type ExistingBudget = z.infer<typeof selectCustomerBudgetSchema>
export type DetailedBudget = Pick<ExistingBudget,"id"|"name"|"period"|"amount"> & {
    spent: number;
    status: "over"|"warning"|"active";
    categoryId: string;
}