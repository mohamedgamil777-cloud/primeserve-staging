"use server"

import { db } from "@/db"
import { faqs, storeEmailPreferences } from "@/db/schema"
import { aboutPageContent, aboutPageContentFormSchema } from "@/db/schema/aboutPageContent"
import { contactInformation, insertStoreContactInfoSchema, insertStoreSocialMediaInfoSchema } from "@/db/schema/contactInformation"
import { faqCategories, insertFAQCategoryTreeSchema } from "@/db/schema/faqCategories"
import { insertPrivacyPolicySchema, privacyPolicy } from "@/db/schema/privacyPolicy"
import { heroSectionUpdateSchema, storeAssets } from "@/db/schema/storeAssets"
import { insertStoreCartSettingsSchema, storeCartSettings } from "@/db/schema/storeCartSettings"
import { insertStoreDisplaySettingsSchema, storeDisplaySettings } from "@/db/schema/storeDisplaySettings"
import { paymentMethodsFormSchema, storePaymentMethods } from "@/db/schema/storePaymentMethods"
import { stores, updateStoreInfoSchema } from "@/db/schema/stores"
import { shippingSchema, storeShippingMethods } from "@/db/schema/storeShippingMethods"
import { insertStoreTaxSettingsSchema, storeTaxSettings } from "@/db/schema/storeTaxSettings"
import { insertTeamMemberSchema, teamMembers, teamMembersSchema } from "@/db/schema/teamMembers"
import { getSession } from "@/lib/auth-server"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom, sanitizeUrl } from "@/lib/utils"
import { sanitizeI18nObject } from "@/types/internationalization"
import { storeAdminEmailNotificationsConfigSchema, storeAuthSupportSettingsSchema, storeCustomerEmailNotificationsConfigSchema, storeEmailProviderConfigSchema } from "@/types/mail"
import { and, eq, notInArray } from "drizzle-orm"
import { z } from "zod"


export const updateStoreDisplaySettings = async (values: z.infer<typeof insertStoreDisplaySettingsSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        insertStoreDisplaySettingsSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof insertStoreDisplaySettingsSchema> = {
            "cartStyle":values.cartStyle,
            "categoryStyle":values.categoryStyle,
            "productStyle":values.productStyle,
            "serviceStyle":values.serviceStyle,
            "showFeaturedProducts":values.showFeaturedProducts,
        }
        const displaySettings = await db.query.storeDisplaySettings.findFirst({"where":(storeDisplaySettings,{eq})=>eq(storeDisplaySettings.storeId,storeId)})
        if(displaySettings) await db.update(storeDisplaySettings).set({
                ...updateObj,
                "updatedAt":new Date()
            }).where(
                eq(storeDisplaySettings.storeId,storeId)
            ).returning()
        else await db.insert(storeDisplaySettings).values({
                ...updateObj,
                "storeId": storeId,
                "updatedAt":new Date()
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


export const updateStoreCartSettings = async (values: z.infer<typeof insertStoreCartSettingsSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        insertStoreCartSettingsSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof insertStoreCartSettingsSchema> = {
            "maxItemsPerOrder":values.maxItemsPerOrder,
            "minItemsPerOrder":values.minItemsPerOrder,
            "maxPurchaseAmount":values.maxPurchaseAmount,
            "minPurchaseAmount":values.minPurchaseAmount,
            "rewardEnabled":values.rewardEnabled,
            "promotionEnabled":values.promotionEnabled
        }
        const cartSettings = await db.query.storeCartSettings.findFirst({"where":(storeCartSettings,{eq})=>eq(storeCartSettings.storeId,storeId)})
        if(cartSettings) await db.update(storeCartSettings).set({
                ...updateObj,
                "updatedAt":new Date()
            }).where(
                eq(storeCartSettings.storeId,storeId)
            ).returning()
        else await db.insert(storeCartSettings).values({
                ...updateObj,
                "storeId": storeId,
                "updatedAt":new Date()
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




export const updateStoreInfo = async (values: z.infer<typeof updateStoreInfoSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        updateStoreInfoSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof updateStoreInfoSchema> = {
            name: hardSanitizeForDom(values.name),
            storeCurrency: values.storeCurrency,
            description: hardSanitizeIfExistsForDom(values.description),
            legalName: hardSanitizeIfExistsForDom(values.legalName),
            taxId: hardSanitizeIfExistsForDom(values.taxId),
            gaId: hardSanitizeIfExistsForDom(values.gaId),
        }
        await db.update(stores).set({
                ...updateObj,
                "updatedAt":new Date()
            }).where(
                eq(stores.id,storeId)
            ).returning()
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


export const updateStorePrivacyPolicy = async (values: z.infer<typeof insertPrivacyPolicySchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        insertPrivacyPolicySchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof insertPrivacyPolicySchema> = {
            lastUpdated: hardSanitizeIfExistsForDom(values.lastUpdated),
            overview:hardSanitizeIfExistsForDom(values.overview),
            introduction: hardSanitizeIfExistsForDom(values.introduction),
            dataCollection: hardSanitizeIfExistsForDom(values.dataCollection),
            dataUsage: hardSanitizeIfExistsForDom(values.dataUsage),
            dataSecurity: hardSanitizeIfExistsForDom(values.dataSecurity),
            cookies: hardSanitizeIfExistsForDom(values.cookies),
            thirdParty: hardSanitizeIfExistsForDom(values.thirdParty),
            contact: hardSanitizeIfExistsForDom(values.contact),
            dataRetention: hardSanitizeIfExistsForDom(values.dataRetention),
            childrenPrivacy: hardSanitizeIfExistsForDom(values.childrenPrivacy),
            internationalDataTransfers: hardSanitizeIfExistsForDom(values.internationalDataTransfers),
            changesToThisPolicy: hardSanitizeIfExistsForDom(values.changesToThisPolicy),
        }
        if((await db.select({storeId:privacyPolicy.storeId}).from(privacyPolicy).where(eq(privacyPolicy.storeId,storeId))).length > 0) await db.update(privacyPolicy).set({
                ...updateObj,
                "updatedAt":new Date()
            }).where(
                eq(privacyPolicy.storeId,storeId)
            )
        else await db.insert(privacyPolicy).values({
            ...updateObj,
            storeId,
            "updatedAt":new Date(),
            "createdAt":new Date(),
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




export const updateStoreFAQs = async (values: z.infer<typeof insertFAQCategoryTreeSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        insertFAQCategoryTreeSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        await db.delete(faqCategories).where(
            and(
                eq(faqCategories.storeId,storeId),
            )
        )
        for(const cat of values.categories){
            const [newCat] = await db.insert(faqCategories).values({
                ...cat,
                storeId
            }).returning()
            if(cat.faqs.length > 0) await db.insert(faqs).values(cat.faqs.map(faq=>({
                ...faq,
                "categoryId":newCat.id,
                storeId
            })))
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




export const updateStorePaymentMethods = async (values: z.infer<typeof paymentMethodsFormSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        paymentMethodsFormSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        for(const paymentMethod of Object.entries(values)){
            const exists = await db.query.storePaymentMethods.findFirst({
                "where":(storePaymentMethods,{eq,and})=>and(
                    eq(storePaymentMethods.storeId,storeId),
                    eq(storePaymentMethods.method,paymentMethod[0] as "cash")
                )
            }) 
            if(exists) await db.update(storePaymentMethods)
                .set({
                    "enabled":paymentMethod[1]
                })
                .where(
                    and(
                        eq(storePaymentMethods.storeId,storeId),
                        eq(storePaymentMethods.method,paymentMethod[0] as "cash")
                    )
                )
            else await db.insert(storePaymentMethods).values({
                "storeId":storeId,
                "method":paymentMethod[0] as "cash",
                "enabled":paymentMethod[1]
            })
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


export const updateStoreShippingMethods = async (values: z.infer<typeof shippingSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        shippingSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        for(const shippingMethod of Object.entries(values)){
            const exists = await db.query.storeShippingMethods.findFirst({
                "where":(storeShippingMethods,{eq,and})=>and(
                    eq(storeShippingMethods.storeId,storeId),
                    eq(storeShippingMethods.method,shippingMethod[0] as "free")
                )
            }) 
            if(exists) await db.update(storeShippingMethods)
                .set({
                    "enabled":shippingMethod[1]["enabled"],
                    "price":shippingMethod[1]["cost"]
                })
                .where(
                    and(
                        eq(storeShippingMethods.storeId,storeId),
                        eq(storeShippingMethods.method,shippingMethod[0] as "free")
                    )
                )
            else await db.insert(storeShippingMethods).values({
                "storeId":storeId,
                "method":shippingMethod[0] as "free",
                "enabled":shippingMethod[1]["enabled"],
                "price":shippingMethod[1]["cost"],
            })
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



export const updateStoreTaxSettings = async (values: z.infer<typeof insertStoreTaxSettingsSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        insertStoreTaxSettingsSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof insertStoreTaxSettingsSchema> = {
            "defaultRate":values.defaultRate,
            "pricesIncludeTax":values.pricesIncludeTax,
            "enableTax":values.enableTax
        }
        const exists = await db.query.storeTaxSettings.findFirst({
            "where":(storeTaxSettings,{eq,and})=>eq(storeTaxSettings.storeId,storeId)
        }) 
        if(exists) await db.update(storeTaxSettings)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(storeTaxSettings.storeId,storeId)
            )
        else await db.insert(storeTaxSettings).values({
            ...updateObj,
            "updatedAt":new Date(),
            "storeId":storeId,
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




export const updateStoreAboutPageContent = async (values: z.infer<typeof aboutPageContentFormSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        aboutPageContentFormSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof aboutPageContentFormSchema> = {
            "happyCustomers":hardSanitizeForDom(values.happyCustomers ?? ""),
            "heroDescription":hardSanitizeForDom(values.heroDescription ?? ""),
            "heroTitle":hardSanitizeForDom(values.heroTitle ?? ""),
            "mission":hardSanitizeForDom(values.mission ?? ""),
            "productsAvailable":hardSanitizeForDom(values.productsAvailable ?? ""),
            "values":hardSanitizeForDom(values.values ?? ""),
            "vision":hardSanitizeForDom(values.vision ?? ""),
            "yearsInBusiness":hardSanitizeForDom(values.yearsInBusiness ?? ""),
        }
        const exists = await db.query.aboutPageContent.findFirst({
            "where":(aboutPageContent,{eq,and})=>eq(aboutPageContent.storeId,storeId)
        }) 
        if(exists) await db.update(aboutPageContent)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(aboutPageContent.storeId,storeId)
            )
        else await db.insert(aboutPageContent).values({
            ...updateObj,
            "updatedAt":new Date(),
            "storeId":storeId,
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


export const updateStoreHeroSection = async (values: z.infer<typeof heroSectionUpdateSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        heroSectionUpdateSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof heroSectionUpdateSchema> = {
            "heroTitleI18n":sanitizeI18nObject(values.heroTitleI18n),
            "heroDescriptionI18n":sanitizeI18nObject(values.heroDescriptionI18n),
            "heroMainButtonTextI18n":sanitizeI18nObject(values.heroMainButtonTextI18n),
            "heroMainButtonLink":sanitizeUrl(values.heroMainButtonLink ?? ""),
            "heroSecondaryButtonTextI18n":sanitizeI18nObject(values.heroSecondaryButtonTextI18n),
            "heroSecondaryButtonLink":sanitizeUrl(values.heroSecondaryButtonLink ?? ""),
        }
        const exists = await db.query.storeAssets.findFirst({
            "where":(storeAssets,{eq,and})=>eq(storeAssets.storeId,storeId)
        }) 
        if(exists) await db.update(storeAssets)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(storeAssets.storeId,storeId)
            )
        else await db.insert(storeAssets).values({
            ...updateObj,
            "updatedAt":new Date(),
            "createdAt":new Date(),
            "storeId":storeId,
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



export const updateStoreContactInfo = async (values: z.infer<typeof insertStoreContactInfoSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        insertStoreContactInfoSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof insertStoreContactInfoSchema> = {
            "businessHours":hardSanitizeForDom(values.businessHours ?? ""),
            "contactFormEnabled":values.contactFormEnabled ?? false,
            "customerServicePhone":hardSanitizeForDom(values.customerServicePhone ?? ""),
            "officeAddress":hardSanitizeForDom(values.officeAddress ?? ""),
            "liveChatEnabled":values.liveChatEnabled ?? false,
            "supportEmail":values.supportEmail
        }
        const exists = await db.query.contactInformation.findFirst({
            "where":(contactInformation,{eq,and})=>eq(contactInformation.storeId,storeId)
        }) 
        if(exists) await db.update(contactInformation)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(contactInformation.storeId,storeId)
            )
        else await db.insert(contactInformation).values({
            ...updateObj,
            "updatedAt":new Date(),
            "storeId":storeId,
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


export const updateStoreSocialMediaInfo = async (values: z.infer<typeof insertStoreSocialMediaInfoSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        insertStoreSocialMediaInfoSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof insertStoreSocialMediaInfoSchema> = {
            "facebook":values.facebook,
            "twitter":values.twitter,
            "instagram":values.instagram,
            "pinterest":values.pinterest,
            "tiktok":values.tiktok,
            "youtube":values.youtube,
        }
        const exists = await db.query.contactInformation.findFirst({
            "where":(contactInformation,{eq,and})=>eq(contactInformation.storeId,storeId)
        }) 
        if(exists) await db.update(contactInformation)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(contactInformation.storeId,storeId)
            )
        else await db.insert(contactInformation).values({
            ...updateObj,
            "updatedAt":new Date(),
            "storeId":storeId,
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




export const updateStoreTeamMembers = async (values: z.infer<typeof teamMembersSchema>) => {
    const memberIds:string[] = []
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        teamMembersSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        for(const teamMember of values.members){
            const updateObj:z.infer<typeof insertTeamMemberSchema> = {
                "name":hardSanitizeForDom(teamMember.name),
                "role":hardSanitizeForDom(teamMember.role),
                "bio":hardSanitizeIfExistsForDom(teamMember.bio),
            }
            const exists = teamMember.id ? await db.query.teamMembers.findFirst({
                "where":(teamMembers,{eq,and})=>and(
                    eq(teamMembers.storeId,storeId),
                    eq(teamMembers.id,teamMember.id!)
                )
            }) : undefined 
            const [updatedMember] = exists ? await db.update(teamMembers)
                .set({
                    ...updateObj,
                    "updatedAt":new Date()
                })
                .where(
                    and(
                        eq(teamMembers.storeId,storeId),
                        eq(teamMembers.id,teamMember.id!)
                    )
                ).returning({"id":teamMembers.id})
            : await db.insert(teamMembers).values({
                ...updateObj,
                "storeId":storeId,
                // will be uploaded using api
                "image":""
            }).returning({"id":teamMembers.id})
            memberIds.push(updatedMember.id)
        }
        return {
            success: true,
            memberIds
        }
    } 
    catch (error) {
        if((error as Error).message === "NEXT_REDIRECT") throw error
        console.error(error)
        return {"error":"something went wrong, try again later."}		
    }	
}

export const deleteStoreTeamMember = async (teamMemberId:string) => {
    const memberIds:string[] = []
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        await db.delete(teamMembers).where(
            and(
                eq(teamMembers.storeId,storeId),
                eq(teamMembers.id,teamMemberId)
            )
        ) 
        return {
            success: true,
            memberIds
        }
    } 
    catch (error) {
        if((error as Error).message === "NEXT_REDIRECT") throw error
        console.error(error)
        return {"error":"something went wrong, try again later."}		
    }	
}



export const updateStoreEmailProviderConfig = async (values: z.infer<typeof storeEmailProviderConfigSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        storeEmailProviderConfigSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof storeEmailProviderConfigSchema> = {
            resendApiKey: hardSanitizeIfExistsForDom(values?.resendApiKey) ?? "",
            fromEmail: hardSanitizeIfExistsForDom(values?.fromEmail) ?? "",
            replyToEmail: hardSanitizeIfExistsForDom(values?.replyToEmail) ?? "",
            emailSenderName: hardSanitizeIfExistsForDom(values?.emailSenderName) ?? "",
        }
        const exists = await db.query.storeEmailPreferences.findFirst({
            "where":(storeEmailPreferences,{eq,and})=>eq(storeEmailPreferences.storeId,storeId)
        }) 
        if(exists) await db.update(storeEmailPreferences)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(storeEmailPreferences.storeId,storeId)
            )
        else await db.insert(storeEmailPreferences).values({
            ...updateObj,
            "updatedAt":new Date(),
            "storeId":storeId,
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

export const updateStoreAdminEmailNotificationsConfig = async (values: z.infer<typeof storeAdminEmailNotificationsConfigSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        storeAdminEmailNotificationsConfigSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof storeAdminEmailNotificationsConfigSchema> = {
            notifyOnNewOrder: values.notifyOnNewOrder,
            notifyOnOrderStatusChange: values.notifyOnOrderStatusChange,
            orderNotificationEmail: hardSanitizeIfExistsForDom(values.orderNotificationEmail) ?? "",

            notifyOnServiceRequest: values.notifyOnServiceRequest,
            notifyOnServiceStatusChange: values.notifyOnServiceStatusChange,
            serviceNotificationEmail: hardSanitizeIfExistsForDom(values.serviceNotificationEmail) ?? "",

            notifyOnCustomerMessage: values.notifyOnCustomerMessage,
            customerMessageNotificationEmail: hardSanitizeIfExistsForDom(values.customerMessageNotificationEmail) ?? "",

        }
        await db.update(storeEmailPreferences)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(storeEmailPreferences.storeId,storeId)
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

export const updateStoreCustomerEmailNotificationsConfig = async (values: z.infer<typeof storeCustomerEmailNotificationsConfigSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        storeCustomerEmailNotificationsConfigSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof storeCustomerEmailNotificationsConfigSchema> = {
            notifyCustomerOnOrderStatusChange: values.notifyCustomerOnOrderStatusChange,
            notifyCustomerOnServiceStatusChange: values.notifyCustomerOnServiceStatusChange,
        }
        await db.update(storeEmailPreferences)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(storeEmailPreferences.storeId,storeId)
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

export const updateStoreAuthSupportSettings = async (values: z.infer<typeof storeAuthSupportSettingsSchema>) => {
    const [session,storeId] = await Promise.all([
        getSession(),
        getTenantId()
    ])
    if(!session) return {"error":errorMsgs.NotAuthenticated}
    if(!session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}
    try {
        storeAuthSupportSettingsSchema.parse(values)
    } catch (error: unknown) {
        return {
            error: (error as Error)?.message,
        }
    }
    try {
        const updateObj:z.infer<typeof storeAuthSupportSettingsSchema> = {
            supportPasswordReset: values.supportPasswordReset,
            supportEmailVerification: values.supportEmailVerification,
            supportPromotionalEmails: values.supportPromotionalEmails,
        }
        await db.update(storeEmailPreferences)
            .set({
                ...updateObj,
                "updatedAt":new Date()
            })
            .where(
                eq(storeEmailPreferences.storeId,storeId)
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
