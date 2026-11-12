import { ServiceFilters, ServiceItem, ServicePublicItem } from "@/types/services"
import { db } from ".."


export const getServiceItems = async ({storeId,page,filter,isActive,isFeatured}:{storeId:string,filter:ServiceFilters,page:number,isActive?:boolean,isFeatured?:boolean}):Promise<ServicePublicItem[]> =>{
    return await db.query.services.findMany({
        "columns":{
            id: true,
            nameI18n: true,
            price: true,
            pricingModel: true,
            isActive: true,
            rating: true,
            categoryId: true,
            type:true,
            estimatedDuration:true,
            shortDescriptionI18n:true,
            features:true,
            reviewCount:true
        },
        "with":{
            "category":{
                "columns":{
                    "id":true,
                    "nameI18n":true
                }
            },
            "images":{
                "columns":{
                    "src":true,
                    "sortOrder":true
                }
            }
        },
        "where":(services,{eq,sql,or,gt,lte,gte,lt,inArray,and,ilike})=>and(
            eq(services.storeId,storeId),
            typeof isFeatured === "undefined" ? undefined : eq(services.isFeatured,isFeatured),
            typeof isActive === "undefined" ? undefined : eq(services.isActive,isActive),
            // filter?.query ? or(
            //     ilike(services.nameI18n,`%${filter.query}%`),
            //     ilike(services.shortDescription,`%${filter.query}%`),
            //     ilike(services.longDescription,`%${filter.query}%`),
            // ) : undefined,
            !filter.categoryId ? undefined : eq(services.categoryId,filter.categoryId),
            !filter.type ? undefined : eq(services.type,filter.type),
        ),
        "offset":(page - 1)*10,
        "limit":10,
        "orderBy":(services,{asc,desc})=>(
            desc(services.updatedAt)
        )
    })
}