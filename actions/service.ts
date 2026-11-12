"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, slugify } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { additionalServiceOptions, serviceImages, services } from "@/db/schema"
import { insertServiceSchema } from "@/db/schema/services"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { getLocalizedValue, sanitizeI18nObject } from "@/types/internationalization"


export const updateService = async (values: z.infer<typeof insertServiceSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertServiceSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:Omit<z.infer<typeof insertServiceSchema>,"additionalServices"|"images"> = {
			"nameI18n":sanitizeI18nObject(values.nameI18n),
			"categoryId":values.categoryId,
			"shortDescriptionI18n":sanitizeI18nObject(values.shortDescriptionI18n),
			"longDescriptionI18n":sanitizeI18nObject(values.longDescriptionI18n),
			"pricingModel": values.pricingModel,
			"type": hardSanitizeForDom(values.type), // e.g., "Installation"
			"price": values.price,
			"features":values.features.map(hardSanitizeForDom),
			"requirements":values.requirements.map(hardSanitizeForDom),
			"inclusions":values.inclusions.map(hardSanitizeForDom),
			"estimatedDuration": hardSanitizeForDom(values.estimatedDuration),
			"standardPriorityFee": values.standardPriorityFee,
			"mediumPriorityFee": values.mediumPriorityFee,
			"highPriorityFee": values.highPriorityFee,
			"isActive": values.isActive ?? false,
			"isFeatured": values.isFeatured ?? false,
		}
		const [service] = values.id
		?
		await db.update(services).set({
			...updateObj,
			"updatedAt":new Date()
		}).where(
			and(
				eq(services.storeId,storeId),
				eq(services.id,values.id),
			)
		).returning()
		:
		await db.insert(services).values({
			...updateObj,
			"slug":slugify(hardSanitizeForDom(getLocalizedValue(values.nameI18n,"en") ?? "")),
			"storeId": storeId,
			"updatedAt":new Date(),
			"createdAt":new Date(),
		}).returning()

		for(const addOn of values.additionalServices){
			if(addOn.id) await db.update(additionalServiceOptions).set({
				"name":addOn.name,
				"price":addOn.price
			}).where(and(
				eq(additionalServiceOptions.id,addOn.id),
				eq(additionalServiceOptions.serviceId,service.id)
			))
			else await db.insert(additionalServiceOptions).values({
				"name":addOn.name,
				"price":addOn.price,
				"serviceId":service.id
			})
		}

		if(values.id && values.images.length > 0){
			for(const image of values.images){
				await db.update(serviceImages).set({
					"sortOrder":image.sortOrder ?? 0
				}).where(
					and(
						eq(serviceImages.id,image.id),
						eq(serviceImages.serviceId,service.id)
					)
				)
			}
		}

		return {
			success: true,
			serviceId:service.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}





export const deleteService = async (serviceId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.delete(services)
			.where(
				and(
					eq(services.id,serviceId),
					eq(services.storeId,storeId),
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


export const toggleServiceStatus = async (serviceId:string,newStatus:boolean) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.update(services)
			.set({
				"isActive":newStatus
			})
			.where(
				and(
					eq(services.id,serviceId),
					eq(services.storeId,storeId),
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

