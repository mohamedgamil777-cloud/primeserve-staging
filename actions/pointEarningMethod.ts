"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, slugify } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { pointEarningMethods } from "@/db/schema"
import { insertPointEarningMethodSchema } from "@/db/schema/pointEarningMethods"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"


export const updatePointEarningMethod = async (values: z.infer<typeof insertPointEarningMethodSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertPointEarningMethodSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertPointEarningMethodSchema> = {
			"name":hardSanitizeForDom(values.name),
			"description":hardSanitizeIfExistsForDom(values.description),
			"isActive": values.isActive ?? false,
			"conditions":hardSanitizeIfExistsForDom(values.conditions),
			"frequency":values.frequency,
			"pointsAwarded":values.pointsAwarded,
			"pointsPerDollar":values.pointsPerDollar,
			"type":values.type
		}
		const [pointEarningMethod] = values.id
		?
		await db.update(pointEarningMethods).set({
			...updateObj,
			"updatedAt":new Date(),
		}).where(
			and(
				eq(pointEarningMethods.storeId,storeId),
				eq(pointEarningMethods.id,values.id),
			)
		).returning()
		:
		await db.insert(pointEarningMethods).values({
			...updateObj,
			"createdAt":new Date(),
			"updatedAt":new Date(),
			"storeId": storeId,
		}).returning()
		return {
			success: true,
			pointEarningMethodId:pointEarningMethod.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}




export const togglePointEarningMethodActivation = async (pointEarningMethodId:string,newState:boolean) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.update(pointEarningMethods)
			.set({
				"isActive":newState
			})
			.where(
				and(
					eq(pointEarningMethods.id,pointEarningMethodId),
					eq(pointEarningMethods.storeId,storeId),
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


export const deletePointEarningMethod = async (pointEarningMethodId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.delete(pointEarningMethods)
			.where(
				and(
					eq(pointEarningMethods.id,pointEarningMethodId),
					eq(pointEarningMethods.storeId,storeId),
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