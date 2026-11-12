import { db } from ".."
import { DetailedServiceRequest, ServiceRequestFilters } from "@/types/serviceRequest"


export const getServiceRequestItems = async ({storeId,page,filter}:{storeId:string,filter:ServiceRequestFilters,page:number}):Promise<DetailedServiceRequest[]> =>{
    return await db.query.serviceRequests.findMany({
        "columns":{
            "timeline":true,
            "desiredDaytime":true,
            "status":true,
            "urgency":true,
            "description":true,
            "createdAt":true,
            "budget":true,
            "contactMethod":true,
            "id":true        
        },
        "with":{
            "service":{
                "columns":{
                    "id":true,
                    "nameI18n":true,
                    "price":true,
                    "pricingModel":true,
                }
            },
            "customer":{
                "columns":{
                    "firstName":true,
                    "lastName":true,
                    "email":true
                }
            },
            "address":{
                "columns":{
                    "id":true,"address":true,"city":true,"state":true,"phone":true,
                }
            }
        },
        "where":(serviceRequests,{eq,sql,or,gt,lte,gte,lt,inArray,and,ilike})=>and(
            eq(serviceRequests.storeId,storeId),
            !filter.status ? undefined : eq(serviceRequests.status,filter.status),
            !filter.urgency ? undefined : eq(serviceRequests.urgency,filter.urgency),
        ),
        "offset":(page - 1)*10,
        "limit":10,
        "orderBy":(serviceRequests,{asc,desc})=>(
            desc(serviceRequests.updatedAt)
        )
    })
}