import { eq } from "drizzle-orm"
import { db } from ".."
import { storeEmailPreferences } from "../schema/storeEmailPreferences"
import { DEFAULT_TENANT_ID } from "@/consts"

export async function seedStoreEmailPreferences() {
    const [exists] = await db.select({"id":storeEmailPreferences.storeId})
        .from(storeEmailPreferences)
        .where(eq(storeEmailPreferences.storeId,DEFAULT_TENANT_ID))
    if(!exists){
        console.log("Default Store Doesn't have Email Preferences, adding the default Email Preferences....")
        await db.insert(storeEmailPreferences).values({
              storeId: DEFAULT_TENANT_ID,            
              notifyOnNewOrder: true,
              notifyOnServiceRequest: true,
              notifyOnOrderStatusChange: true,
              notifyOnServiceStatusChange: true,
              notifyOnCustomerMessage: true,
                        
              notifyCustomerOnServiceStatusChange: true,
              notifyCustomerOnOrderStatusChange: true,
            
              supportPasswordReset: true,
              supportEmailVerification: true,
              supportPromotionalEmails: false,
            
              createdAt: new Date(),
              updatedAt: new Date(),
        })
    }
}