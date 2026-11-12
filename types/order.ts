import { ORDER_STATUSES, selectOrderSchema } from "@/db/schema/orders";
import { z } from "zod";
import { ExistingUser } from "./user";

export type ExistingOrder = z.infer<typeof selectOrderSchema>
export type OrderSort = "highest"|"lowest"|"newest"|"oldest"
export type OrderStatus = typeof ORDER_STATUSES[number] | "all"

export type OrderFilters = {
    query?:string,
    customerId?:string,
    day?:string,
    status?:OrderStatus,
    sort?:OrderSort,
}


export type OrderItem = Pick<ExistingOrder,"id"|"code"|"status"|"productsCount"|"totalAmount"|"createdAt"> & {
    "user"?:Pick<ExistingUser,"firstName"|"lastName">,
    "items"?:{
        "quantity":number,
        "price":number,
        "product"?:{
            "name":string
        }
    }[]
}