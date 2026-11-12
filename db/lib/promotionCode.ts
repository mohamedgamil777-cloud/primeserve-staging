import { db } from ".."
import { getSession } from "@/lib/auth-server"
import { ilike } from "drizzle-orm"
import { PromotionCode, PromotionCodeFilters } from "@/types/promotionCode"


export const getPromotionCodes = async (storeId:string,filter:PromotionCodeFilters,page:number):Promise<PromotionCode[]> =>{
    const session = await getSession()
    return await db.query.promotionCodes.findMany({
        "columns":{
            id: true,
            code: true,
            createdAt: true,
            type: true,
            value: true,
            description: true,
            minPurchase: true,
            usageLimit: true,
            usageCount: true,
            startDate: true,
            endDate: true,
            isActive: true,
        },
        "where":(promotionCodes,{eq,lt,gt,gte,lte,or,and,isNull})=>and(
            eq(promotionCodes.storeId,storeId),
            !filter.query ? undefined : or(
                ilike(promotionCodes.code,`%${filter.query}%`),
                ilike(promotionCodes.description,`%${filter.query}%`),
            ),
            (
                filter.status === "disabled"
                ?
                eq(promotionCodes.isActive,false)
                :
                filter.status === "scheduled"
                ?
                gt(promotionCodes.startDate,new Date())
                :
                filter.status === "expired"
                ?
                lt(promotionCodes.endDate,new Date())
                :
                filter.status === "active"
                ?
                and(
                    eq(promotionCodes.isActive,true),
                    or(
                        gte(promotionCodes.endDate,new Date()),
                        isNull(promotionCodes.endDate)
                    ),
                    lte(promotionCodes.startDate,new Date())
                )
                :
                undefined
            )
        ),
        "offset":(page - 1)*10,
        "limit":10,
        "orderBy":(promotionCodes,{desc})=>(
            desc(promotionCodes.updatedAt)
        )
    })
}