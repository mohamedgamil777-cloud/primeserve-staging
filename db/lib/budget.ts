import { eq, and, between, inArray } from 'drizzle-orm'
import { db } from '..'
import { customerBudgets } from '../schema/customerBudgets'
import { getBounds } from '@/lib/date'
import { customerCategorySpending } from '../schema/customerCategorySpending'
import { DetailedBudget } from '@/types/budget'

export async function getCustomerBudgets(customerId: string,storeId: string):Promise<DetailedBudget[]> {
  // Step 1: Get all budgets for this customer
  const budgets = await db.select(
      {
        "name":customerBudgets.name,
        "id":customerBudgets.id,
        "period":customerBudgets.period,
        "categoryId":customerBudgets.categoryId,
        "amount":customerBudgets.amount,
      }
    )
    .from(customerBudgets)
    .where(eq(customerBudgets.customerId, customerId))

  const results = await Promise.all(
    budgets.map(async (budget) => {
      const { start, end } = getBounds(budget.period)

      const amounts = await db
        .select({
          amount: customerCategorySpending.amount,
        })
        .from(customerCategorySpending)
        .where(
          and(
            eq(customerCategorySpending.customerId, customerId),
            eq(customerCategorySpending.storeId, storeId),
            eq(customerCategorySpending.categoryId, budget.categoryId),
            between(customerCategorySpending.date, start.toISOString().split('T')[0], end.toISOString().split('T')[0])
          )
        )
      const totalSpent = amounts.reduce((acc,cur)=>acc + cur["amount"],0)
      return {
        ...budget,
        spent: totalSpent,
        status:
          totalSpent >= Number(budget.amount)
            ? 'over' as const
            : totalSpent >= 0.9 * Number(budget.amount)
            ? 'warning' as const
            : 'active' as const,
      }
    })
  )
  return results
}
