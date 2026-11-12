"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, slugify } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { customerPoints, customerRewardRedemptions, rewards } from "@/db/schema"
import { insertRewardSchema } from "@/db/schema/rewards"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { addDays } from "date-fns"
import { adjustCustomerTier } from "@/db/lib/tier"


export const updateReward = async (values: z.infer<typeof insertRewardSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertRewardSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertRewardSchema> = {
			"name":hardSanitizeForDom(values.name),
			"description":hardSanitizeIfExistsForDom(values.description),
			"isActive": values.isActive ?? false,

			"pointsCost": values.pointsCost,
			"type": values.type,
			"value": values.value,
			"minPurchase": values.minPurchase,
			"expiryDays": values.expiryDays
		}
		const [reward] = values.id
		?
		await db.update(rewards).set({
			...updateObj,
			"updatedAt":new Date(),
		}).where(
			and(
				eq(rewards.storeId,storeId),
				eq(rewards.id,values.id),
			)
		).returning()
		:
		await db.insert(rewards).values({
			...updateObj,
			"createdAt":new Date(),
			"updatedAt":new Date(),
			"storeId": storeId,
		}).returning()
		return {
			success: true,
			rewardId:reward.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}




export const toggleRewardActivation = async (rewardId:string,newState:boolean) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.update(rewards)
			.set({
				"isActive":newState
			})
			.where(
				and(
					eq(rewards.id,rewardId),
					eq(rewards.storeId,storeId),
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


export const deleteReward = async (rewardId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.delete(rewards)
			.where(
				and(
					eq(rewards.id,rewardId),
					eq(rewards.storeId,storeId),
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


export const redeemReward = async (rewardId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {
		const [userPoints,reward] = await Promise.all([
			db.query.customerPoints.findFirst({
				"columns":{
					"points":true,
				},
				"where":(customerPoints,{and,eq})=>and(
					eq(customerPoints.storeId,storeId),
					eq(customerPoints.customerId,session.user_id),
				)
			}),
			db.query.rewards.findFirst({
				"columns":{
					"pointsCost":true,
					"expiryDays":true,
				},
				"where":(rewards,{and,eq})=>and(
					eq(rewards.storeId,storeId),
					eq(rewards.id,rewards.id),
				)
			}),
		])
		if(!reward) return {"error":"This reward can not be redeemed."}
		if((userPoints?.points ?? 0) < reward?.pointsCost) return {"error":"You Don't have enough points to redeem this reward"} 
		await Promise.all([
			db.insert(customerRewardRedemptions).values({
				"used":false,
				"customerId":session.user_id,
				"rewardId":rewardId,
				"storeId":storeId,
				"redeemedAt":new Date(),
				"expiresAt":addDays(new Date(), reward.expiryDays)
			}),
			db.update(customerPoints).set({
				"points":(userPoints?.points ?? 0) - reward.pointsCost
			}).where(and(
				eq(customerPoints.customerId,session.user_id),
				eq(customerPoints.storeId,storeId),
			))
		]) 
		await adjustCustomerTier(session.user_id,storeId)
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

