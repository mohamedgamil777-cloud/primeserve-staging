"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, slugify } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { categories } from "@/db/schema"
import { insertCategorySchema } from "@/db/schema/categories"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { sanitizeI18nObject } from "@/types/internationalization"


export const updateCategory = async (values: z.infer<typeof insertCategorySchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertCategorySchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertCategorySchema> = {
			"nameI18n":sanitizeI18nObject(values.nameI18n),
			"descriptionI18n":sanitizeI18nObject(values.descriptionI18n),
			"featured": values.featured ?? false,
			"updatedAt":new Date()
		}
		const [category] = values.id
		?
		await db.update(categories).set(updateObj).where(
			and(
				eq(categories.storeId,storeId),
				eq(categories.id,values.id),
			)
		).returning()
		:
		await db.insert(categories).values({
			...updateObj,
			// will be updated using api
			"image": "",
			"slug":slugify(hardSanitizeForDom(values.nameI18n["en"] ?? Object.values(values.nameI18n).at(0) ?? "")),
			"storeId": storeId,
		}).returning()
		if(values.featured) revalidatePath("/")
		return {
			success: true,
			categoryId:category.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}





export const deleteCategory = async (categoryId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.delete(categories)
			.where(
				and(
					eq(categories.id,categoryId),
					eq(categories.storeId,storeId),
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

