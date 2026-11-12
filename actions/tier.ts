"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, slugify } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { tiers } from "@/db/schema"
import { insertTierSchema } from "@/db/schema/tiers"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"


export const updateTier = async (values: z.infer<typeof insertTierSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertTierSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:Omit<z.infer<typeof insertTierSchema>,"benefits"> & {benefits:string[]} = {
			"name":hardSanitizeForDom(values.name),
			"description":hardSanitizeIfExistsForDom(values.description),
			"isActive": values.isActive ?? false,
			"color": hardSanitizeForDom(values.color),
			"minPoints": values.minPoints,
			"maxPoints": values.maxPoints,
			"benefits": values.benefits?.split("\n").map(hardSanitizeForDom) ?? [],
			"pointsMultiplier": values.pointsMultiplier,
		}
		const [tier] = values.id
		?
		await db.update(tiers).set({
			...updateObj,
			"updatedAt":new Date(),
		}).where(
			and(
				eq(tiers.storeId,storeId),
				eq(tiers.id,values.id),
			)
		).returning()
		:
		await db.insert(tiers).values({
			...updateObj,
			"createdAt":new Date(),
			"updatedAt":new Date(),
			"storeId": storeId,
		}).returning()
		return {
			success: true,
			tierId:tier.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}




export const toggleTierActivation = async (tierId:string,newState:boolean) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.update(tiers)
			.set({
				"isActive":newState
			})
			.where(
				and(
					eq(tiers.id,tierId),
					eq(tiers.storeId,storeId),
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


export const deleteTier = async (tierId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.delete(tiers)
			.where(
				and(
					eq(tiers.id,tierId),
					eq(tiers.storeId,storeId),
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