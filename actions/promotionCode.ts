"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, slugify } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { promotionCodes } from "@/db/schema"
import { insertPromotionCodeSchema } from "@/db/schema/promotionCodes"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { CustomerPromotionCode } from "@/types/promotionCode"


export const updatePromotionCode = async (values: z.infer<typeof insertPromotionCodeSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertPromotionCodeSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertPromotionCodeSchema> = {
			"description":hardSanitizeIfExistsForDom(values.description),
			"code": hardSanitizeForDom(values.code), // not unique globally
			"type": values.type,
			"value": values.value,
			"minPurchase": values.minPurchase,
			"usageLimit": values.usageLimit,
			"usageCount": values.usageCount,
			"startDate": values.startDate,
			"endDate": values.endDate,
			"isActive": values.isActive,
		}
		const [promotionCode] = values.id
		?
		await db.update(promotionCodes).set({
			...updateObj,
			"updatedAt":new Date()
		}).where(
			and(
				eq(promotionCodes.storeId,storeId),
				eq(promotionCodes.id,values.id),
			)
		).returning()
		:
		await db.insert(promotionCodes).values({
			...updateObj,
			"storeId": storeId,
			"createdAt":new Date(),
			"updatedAt":new Date(),
		}).returning()
		return {
			success: true,
			promotionCodeId:promotionCode.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}





export const deletePromotionCode = async (promotionCodeId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.delete(promotionCodes)
			.where(
				and(
					eq(promotionCodes.id,promotionCodeId),
					eq(promotionCodes.storeId,storeId),
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

export const togglePromotionCodeActivation = async (promotionCodeId:string,newState:boolean) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.update(promotionCodes)
			.set({
				"isActive":newState,
				"updatedAt":new Date()
			})
			.where(
				and(
					eq(promotionCodes.id,promotionCodeId),
					eq(promotionCodes.storeId,storeId),
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


export const applyPromotionCode = async (promotionCode:string,total:number) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {		
		const promotion = await db.query.promotionCodes.findFirst({
			"columns":{
				"id":true,
				"code":true,
				"value":true,
				"type":true,
				"usageLimit":true,
				"usageCount":true,
				"minPurchase":true
			},
			"where":(promotionCodes,{eq,and})=>and(
				eq(promotionCodes.code,promotionCode),
				eq(promotionCodes.isActive,true),
				eq(promotionCodes.storeId,storeId),
			)
		})
		if(
			!promotion
			||
			(promotion.usageLimit && promotion.usageCount >= promotion.usageLimit)
		) return {"error":"This promotion code is not valid."}

		const usedPromotion = await db.query.promotionCodeUsages.findFirst({
			"where":(promotionCodeUsages,{eq,and})=>and(
				eq(promotionCodeUsages.promotionCodeId,promotion.id),				
				eq(promotionCodeUsages.customerId,session.user_id),				
			)
		})

		if(usedPromotion) return {"error":"You have used this promotion code before, it can not be used more than once."}
		
		if(promotion.minPurchase && total < promotion.minPurchase) return {"error":`To use this promotion code your order's total need to be ${promotion.minPurchase} as minimum`}
		const customerPromotion:CustomerPromotionCode = promotion
		return {
			promotion:{
				...customerPromotion,
				"usageLimit":undefined,
				"usageCount":undefined,
				"minPurchase":undefined
			},
		}
	
	}
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	
}

