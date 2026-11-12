"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, slugify } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { serviceCategories } from "@/db/schema"
import { insertServiceCategorySchema } from "@/db/schema/serviceCategories"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { getLocalizedValue, sanitizeI18nObject } from "@/types/internationalization"


export const updateServiceCategory = async (values: z.infer<typeof insertServiceCategorySchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertServiceCategorySchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertServiceCategorySchema> = {
			"nameI18n":sanitizeI18nObject(values.nameI18n),
			"descriptionI18n":sanitizeI18nObject(values.descriptionI18n),
			"longDescriptionI18n":sanitizeI18nObject(values.longDescriptionI18n),
			"isActive": values.isActive ?? false,
			"isFeatured": values.isFeatured ?? false,
			"icon":values.icon
		}
		const [serviceCategory] = values.id
		?
		await db.update(serviceCategories).set({
			...updateObj,
			"updatedAt":new Date(),
			})
			.where(
			and(
				eq(serviceCategories.storeId,storeId),
				eq(serviceCategories.id,values.id),
			)
		).returning()
		:
		await db.insert(serviceCategories).values({
			...updateObj,
			"slug":slugify(hardSanitizeForDom(getLocalizedValue(values.nameI18n,"en")?.at(0) ?? "")),
			"storeId": storeId,
			"updatedAt":new Date(),
			"createdAt":new Date()
		}).returning()
		return {
			success: true,
			serviceCategoryId:serviceCategory.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}





export const deleteServiceCategory = async (serviceCategoryId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.delete(serviceCategories)
			.where(
				and(
					eq(serviceCategories.id,serviceCategoryId),
					eq(serviceCategories.storeId,storeId),
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


export const toggleServiceCategoryStatus = async (serviceCategoryId:string,newStatus:boolean) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.update(serviceCategories)
			.set({
				"isActive":newStatus
			})
			.where(
				and(
					eq(serviceCategories.id,serviceCategoryId),
					eq(serviceCategories.storeId,storeId),
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

