"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { categories } from "@/db/schema"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { insertSubCategorySchema, subcategories } from "@/db/schema/subcategories"
import { sanitizeI18nObject } from "@/types/internationalization"


export const updateSubCategory = async (values: z.infer<typeof insertSubCategorySchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertSubCategorySchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertSubCategorySchema> = {
			"nameI18n":sanitizeI18nObject(values.nameI18n),
			"descriptionI18n":sanitizeI18nObject(values.descriptionI18n),
			// "featured": values.featured ?? false,
			"categoryId": values.categoryId,
			"updatedAt":new Date()
		}
		const [ownsCategory] = await db.select().from(categories).where(
			and(
				eq(categories.id,values.categoryId),
				eq(categories.storeId,storeId)
			)
		)
		if(!ownsCategory) return {
			"error":errorMsgs.NotAuthorized
		}


		const [subcategory] = values.id
		?
		await db.update(subcategories).set(updateObj).where(
			eq(subcategories.id,values.id),
		).returning()
		:
		await db.insert(subcategories).values({
			...updateObj,
			// will be updated using api
			"image": "",
			"createdAt":new Date(),
		}).returning()
		return {
			success: true,
			subcategoryId:subcategory.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}





export const deleteSubCategory = async (subcategoryId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}

	try {

		const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id,subcategoryId))
		const [ownsCategory] = subcategory ? await db.select().from(categories).where(
			and(
				eq(categories.id,subcategory.categoryId),
				eq(categories.storeId,storeId)
			)
		) : []
		if(!ownsCategory) return {
			"error":errorMsgs.NotAuthorized
		}

		await db.delete(subcategories)
			.where(
				eq(subcategories.id,subcategoryId),
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

