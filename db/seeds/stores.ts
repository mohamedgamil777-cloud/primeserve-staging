import { eq } from "drizzle-orm";
import { db } from "..";
import { faqCategories, faqs, privacyPolicy, stores, storeUsers, users } from "../schema";
import { DEFAULT_TENANT_ADMIN_ID, DEFAULT_TENANT_ID } from "@/consts";
import * as argon2 from "@node-rs/argon2"
import { DEFAULT_PRIVECY_POLICY } from "@/data/privacyPolicy";
import { DEFAULT_FAQ_CATEGORIES } from "@/data/faqCategories";


export async function seedStores() {
    const [exists] = await db.select({"id":stores.id}).from(stores).where(eq(stores.id,DEFAULT_TENANT_ID))
    if(!exists){
        console.log("Default Store Doesn't exist, adding the default store....")
        await db.insert(stores).values({
            "name":"Primeserve",
            "slug":"prime-serve",
            "subdomain":"primeserve",
            "id":DEFAULT_TENANT_ID,
        })
        const [newUser] = await db.insert(users).values({
            "id":DEFAULT_TENANT_ADMIN_ID,
            "role":"seller",
            "firstName":"Primeserve",
            "lastName":"Admin",
            "email":"admin@primsrv.com",
            "password":await argon2.hash("123456789"),
            "storeId":DEFAULT_TENANT_ID
        }).returning()
        await db.insert(storeUsers).values({
            "userId":newUser.id,
            "storeId":DEFAULT_TENANT_ID,
            "role":"owner"
        })
        await db.insert(privacyPolicy).values({
            ...DEFAULT_PRIVECY_POLICY,
            "storeId":DEFAULT_TENANT_ID,
        })
        for(const cat of DEFAULT_FAQ_CATEGORIES){
            const [category] = await db.insert(faqCategories).values({
                ...cat,
                "storeId":DEFAULT_TENANT_ID
            }).returning()
            for(const faq of cat.faqs){
                await db.insert(faqs).values({
                    ...faq,
                    "storeId":DEFAULT_TENANT_ID,
                    "categoryId":category.id
                })
            }
        }
    }
}