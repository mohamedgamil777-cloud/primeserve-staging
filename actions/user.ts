"use server"
import { hardSanitizeForDom } from "@/lib/utils"
import { z } from "zod"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { errorMsgs } from "@/lib/error"
import { updateUserSchema, users } from "@/db/schema/users"
import { insertUserEmailPreferencesSchema, userPreferences } from "@/db/schema/userPreferences"
import { accountDeletionSchema } from "@/types/user"
import { accountDeletionRequests } from "@/db/schema"
import { getTenantId } from "@/lib/tenant"


export const updateUserInfo = async (values: z.infer<typeof updateUserSchema>) => {
    const session = await getSession()
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    try {
        updateUserSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof updateUserSchema> = {
            "firstName":hardSanitizeForDom(values.firstName),
            "lastName":hardSanitizeForDom(values.lastName),
            "phone":values.phone,
            "email":values.email,
        }

        await db.update(users).set({
            ...updateObj,
            "updatedAt":new Date()
        }).where(eq(users.id,session.user_id))

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

export const updateCustomerNotes = async (notes:string,customerId:string) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ]) 
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(session.user_role !== "seller" || !session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try{
        await db.update(users).set({
            "customerNotes":hardSanitizeForDom(notes),
            "updatedAt":new Date()
        }).where(
            and(
                eq(users.storeId,storeId),
                eq(users.id,customerId),
            )
        )
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


export const updateUserEmailPreferences = async (values: z.infer<typeof insertUserEmailPreferencesSchema>) => {
    const session = await getSession()
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    try {
        insertUserEmailPreferencesSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof insertUserEmailPreferencesSchema> = {
            "newsletter":values.newsletter,
            "orderUpdates":values.orderUpdates,
            "promotions":values.promotions,
            "recommendations":values.recommendations
        }

        await db.update(userPreferences).set({
            ...updateObj,
            "updatedAt":new Date()
        }).where(eq(userPreferences.userId,session.user_id))

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

export const scheduleAccountForDeletion = async (values: z.infer<typeof accountDeletionSchema>) => {
    const session = await getSession()
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    try {
        accountDeletionSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const pendingRequest = await db.query.accountDeletionRequests.findFirst({
            "where":(accountDeletionRequests,{eq,and})=>and(
                eq(accountDeletionRequests.userId,session.user_id),
                eq(accountDeletionRequests.status,"pending"),
            )
        })
        if(!!pendingRequest) return {"error":"There is already pending deletion request"}
        await db.insert(accountDeletionRequests).values({
            "userId":session.user_id,
            "reason":values.reason === "other" ? values.customReason! : values.reason,
            "status":"pending",
            "requestedAt":new Date()
        })
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

export const cancelAccountDeletion = async () => {
    const session = await getSession()
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    try {
        const pendingRequest = await db.query.accountDeletionRequests.findFirst({
            "where":(accountDeletionRequests,{eq,and})=>and(
                eq(accountDeletionRequests.userId,session.user_id),
                eq(accountDeletionRequests.status,"pending"),
            )
        })
        if(!!pendingRequest){
            await db.update(accountDeletionRequests).set({
                "status":"canceled",
            }).where(eq(accountDeletionRequests.id,pendingRequest.id))
        } 
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
