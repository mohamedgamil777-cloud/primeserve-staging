"use server"
import { hardSanitizeIfExistsForDom } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { getSession } from "@/lib/auth-server"
import { serviceRequests } from "@/db/schema"
import { insertServiceRequestSchema } from "@/db/schema/serviceRequests"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"


export const updateServiceRequest = async (values: z.infer<typeof insertServiceRequestSchema>) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	if(session.user_role !== "customer") return {"error":errorMsgs.NotAuthorized}
	try {
		insertServiceRequestSchema.parse(values)
	} catch (error: unknown) {
		return {
			error: (error as Error)?.message,
		}
	}
	try {
		const updateObj:z.infer<typeof insertServiceRequestSchema> = {
			"addressId":values.addressId,
			"serviceId":values.serviceId,
			"budget":values.budget,
			"contactMethod":values.contactMethod,
			"description":hardSanitizeIfExistsForDom(values.description),
			"desiredDaytime":values.desiredDaytime,
			"timeline":values.timeline,
			"urgency":values.urgency,
			"addtionalServiceIds":values.addtionalServiceIds ?? []
		}
		await db.insert(serviceRequests).values({
			...updateObj,
			"storeId": storeId,
			"userId":session.user_id,
			"status":"pending",
			"updatedAt":new Date(),
			"createdAt":new Date()
		}).returning()
		return {
			success: true,
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}
