import { OrderFilters, OrderItem } from "@/types/order"
import { db } from ".."
import { getSession } from "@/lib/auth-server"
import { ilike } from "drizzle-orm"
import { getDayEnd, getDayStart } from "@/lib/date"


export const getOrderItems = async (storeId:string,filter:OrderFilters,page:number):Promise<OrderItem[]> =>{
    const session = await getSession()
    return await db.query.orders.findMany({
        "columns":{
            id: true,
            code: true,
            createdAt: true,
            status: true,
            productsCount:true,
            totalAmount:true
        },
        "with":(
            session?.user_role === "seller"
            ?
            {
                "user":{
                    "columns":{
                        "firstName":true,
                        "lastName":true
                    }
                },
                "items":{
                    "columns":{
                        "quantity":true,
                        "price":true,
                    },
                    "with":{
                        "product":{
                            "columns":{
                                "nameI18n":true,
                            }
                        }
                    }
                }
            }
            :
            {}
        ),
        "where":(orders,{eq,gte,lte,and})=>and(
            eq(orders.storeId,storeId),
            session?.user_role === "customer" ? eq(orders.userId,session.user_id) : (
                filter.customerId ? eq(orders.userId,filter.customerId) : undefined
            ),
            !filter.query ? undefined : ilike(orders.code,`%${filter.query}%`),
            (!filter.status || filter.status === "all") ? undefined : (
                eq(orders.status,filter.status)
            ),
            !filter.day ? undefined : and(
                gte(orders.createdAt,getDayStart(new Date(filter.day))),
                lte(orders.createdAt,getDayEnd(new Date(filter.day))),
            )
        ),
        "offset":(page - 1)*10,
        "limit":10,
        "orderBy":(orders,{desc,asc})=>(
            filter.sort === "highest"
            ?
            desc(orders.totalAmount)
            :
            filter.sort === "lowest"
            ?
            asc(orders.totalAmount)
            :
            filter.sort === "oldest"
            ?
            asc(orders.createdAt)
            :
            filter.sort === "newest"
            ?
            desc(orders.createdAt)
            :
            desc(orders.updatedAt)
        )
    })
}