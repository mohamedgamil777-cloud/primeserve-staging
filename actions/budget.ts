"use server"
import { hardSanitizeForDom } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { customerBudgets, insertCustomerBudgetSchema } from "@/db/schema/customerBudgets"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"


export const updateBudget = async (values: z.infer<typeof insertCustomerBudgetSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {
		insertCustomerBudgetSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertCustomerBudgetSchema> = {
			name: hardSanitizeForDom(values.name),
			categoryId: values.categoryId,
			period: values.period,
			amount: values.amount
		}

		const [budget] = values.id
		?
		await db.update(customerBudgets).set({...updateObj,"updatedAt":new Date()}).where(
			and(
				eq(customerBudgets.storeId,storeId),
				eq(customerBudgets.id,values.id),
				eq(customerBudgets.customerId,session.user_id)
			)
		).returning()
		:
		await db.insert(customerBudgets).values({
			...updateObj,
			"customerId":session.user_id,
			"updatedAt":new Date(),
			"createdAt":new Date(),
			"storeId": storeId,
		}).returning()
		return {
			success: true,
			budgetId:budget.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}





export const deleteBudget = async (budgetId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {
		await db.delete(customerBudgets)
			.where(
				and(
					eq(customerBudgets.id,budgetId),
					eq(customerBudgets.storeId,storeId),
					eq(customerBudgets.customerId,session.user_id),
				)
			)
	}
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	
	return {
		success: true,
	}
}
