"use server"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, slugify } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, count, eq, sql } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { categories, products, subcategories, users } from "@/db/schema"
import { insertProductSchema } from "@/db/schema/products"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { insertProductStockSubscriptionSchema, productStockSubscriptions } from "@/db/schema/productStockSubscriptions"
import { ExcelProduct } from "@/types/product"
import { getLocalizedValue, sanitizeI18nObject } from "@/types/internationalization"
import { getLocale } from "next-intl/server"


export const updateProduct = async (values: z.infer<typeof insertProductSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		insertProductSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertProductSchema> = {
			"nameI18n":sanitizeI18nObject(values.nameI18n),
			"descriptionI18n":sanitizeI18nObject(values.descriptionI18n),
			// "featured": values.featured ?? false,
			"price":values.price,
			"discountPercentage":values.discountPercentage,
			"stock":values.stock,
			"categoryId":values.categoryId,
			"subcategoryId":values.subcategoryId,
			"updatedAt":new Date(),
			"isNew":values.isNew
		}
		const [product] = values.id
		?
		await db.update(products).set(updateObj).where(
			and(
				eq(products.storeId,storeId),
				eq(products.id,values.id),
			)
		).returning()
		:
		await db.insert(products).values({
			...updateObj,
			"mainImage":"",
			"storeId": storeId,
			"rating": 0,
			"reviewCount": 0,
			"hasVariants": false,
		}).returning()

		const productCount = (await db.select({"count":count(products.id)}).from(products).where(
				and(
					eq(products.storeId,storeId),
					eq(products.subcategoryId,product.subcategoryId)
				)
			))[0]?.["count"] ?? 0
		await db.update(subcategories).set({
			productCount
		}).where(eq(subcategories.id,product.subcategoryId))
		
		return {
			success: true,
			productId:product.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}





export const deleteProduct = async (productId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.delete(products)
			.where(
				and(
					eq(products.id,productId),
					eq(products.storeId,storeId),
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



export const setupProductBackInStockReminder = async (values:z.infer<typeof insertProductStockSubscriptionSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId(),
	])
	try {
		const [user] = !session?.user_id ? [undefined] : await db.select().from(users).where(eq(users.id,session?.user_id))		
		const email = !user?.id ? values.email : user.email
		const phone = !user?.id ? values.phone : user.phone
		if(values.notifyBy === "email" && !email) return {"error":"Email is required if you want to be notified by email"}
		if(values.notifyBy === "sms" && !phone) return {"error":"Phone is required if you want to be notified by phone"}
		
		const [notificationExisits] = await db.select({"id":productStockSubscriptions.id})
			.from(productStockSubscriptions)
			.where(
				and(
					eq(productStockSubscriptions.productId,values.productId),
					eq(productStockSubscriptions.storeId,storeId),
					eq(productStockSubscriptions.notified,false),
					user?.id
					?
					eq(productStockSubscriptions.userId,user.id)
					:
					(
						values.notifyBy === "email"
						?
						eq(productStockSubscriptions.email,email!)
						:
						eq(productStockSubscriptions.phone,phone!)
					)
				)

			)
		if(notificationExisits) await db.update(productStockSubscriptions).set({
			...values,
			email,phone
		}).where(eq(productStockSubscriptions.id,notificationExisits.id))
		else await db.insert(productStockSubscriptions).values({
			...values,
			email,phone,
			storeId,
			"userId":session?.user_id,
		})
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


export const getProductListForExcel = async () => {
	const [
		session,
		storeId,
		locale
	] = await Promise.all([
		getSession(),
		getTenantId(),
		getLocale()
	])
	// if(!session) return {"error":errorMsgs.NotAuthenticated}
	// if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	const isAdmin = session?.user_role === "seller" && session.stores.includes(storeId)
	try {
		const products:ExcelProduct[] = (await db.query.products.findMany(
			{
				"columns":{
					"id":true,
					"nameI18n":true,
					"descriptionI18n":true,
					"stock":true,
				},
				"where":(products,{and,eq,gt,isNotNull})=>and(
					eq(products.storeId,storeId),
					isAdmin ? undefined : isNotNull(products.stock),
					isAdmin ? undefined :  gt(products.stock,0),
				)
			}
		)).map(product=>({...product,"stock":product.stock ?? 0,"name":getLocalizedValue(product.nameI18n,locale as "en") ?? "","description":product.descriptionI18n ? (getLocalizedValue(product.descriptionI18n,locale as "en") ?? "") : ""}))
		.filter(product=>isAdmin || product.stock !== 0)
		return {"data":products}
	}
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	
}


export const updateProductsStock = async (updates:{"id":string,"stock":number}[],mode:"replace" | "add") => {
	const [
		session,
		storeId,
		locale
	] = await Promise.all([
		getSession(),
		getTenantId(),
		getLocale()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(session?.user_role !== "seller" || !session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
	try {
		await db.transaction(async (tx) => {
		for (const update of updates) {
			if (mode === 'replace') {
				await tx
					.update(products)
					.set({ stock: update.stock })
					.where(eq(products.id, update.id));
			} else {
				await tx
					.update(products)
					.set({ 
						stock: sql`${products.stock} + ${update.stock}`
					})
					.where(eq(products.id, update.id));
			}
		}
		});
	}
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	
}


