"use server"
import { hardSanitizeForDom } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { updateAddressSchema, addresses, SupportedCountry } from "@/db/schema/addresses"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"


export const updateAddress = async (values: z.infer<typeof updateAddressSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {
		updateAddressSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof updateAddressSchema> = {
			name: hardSanitizeForDom(values.name),
			firstName: hardSanitizeForDom(values.firstName),
			lastName: hardSanitizeForDom(values.lastName),
			address: hardSanitizeForDom(values.address),
			city: hardSanitizeForDom(values.city),
			state: hardSanitizeForDom(values.state),
			zipCode: hardSanitizeForDom(values.zipCode),
			country: hardSanitizeForDom(values.country) as SupportedCountry,
			phone: hardSanitizeForDom(values.phone),
			isDefault: values.isDefault ?? false,
		}

		if(values.isDefault) await db.update(addresses).set({
			"isDefault":false
		}).where(
			and(
				eq(addresses.storeId,storeId),
				eq(addresses.userId,session.user_id)
			)
		)


		const [address] = values.id
		?
		await db.update(addresses).set({...updateObj,"updatedAt":new Date()}).where(
			and(
				eq(addresses.storeId,storeId),
				eq(addresses.id,values.id),
				eq(addresses.userId,session.user_id)
			)
		).returning()
		:
		await db.insert(addresses).values({
			...updateObj,
			"updatedAt":new Date(),
			"storeId": storeId,
			"userId":session.user_id,
		}).returning()
		return {
			success: true,
			addressId:address.id
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}





export const deleteAddress = async (addressId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {
		await db.delete(addresses)
			.where(
				and(
					eq(addresses.id,addressId),
					eq(addresses.storeId,storeId),
					eq(addresses.userId,session.user_id),
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



export const markAddressAsDefault = async (addressId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {
		await db.update(addresses).set({
			"isDefault":false,
		}).where(
			and(
				eq(addresses.storeId,storeId),
				eq(addresses.userId,session.user_id)
			)
		)
		await db.update(addresses).set({
			"isDefault":true,
			"updatedAt":new Date()
		}).where(
			and(
				eq(addresses.storeId,storeId),
				eq(addresses.userId,session.user_id),
				eq(addresses.id,addressId),
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

