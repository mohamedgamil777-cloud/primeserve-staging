import { CustomerFilters, CustomerItem, CustomerStatus } from "@/types/customer"
import { db } from ".."
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm"
import { orders, users } from "../schema"

export const getCustomerItems = async (storeId: string, filter: CustomerFilters, page: number): Promise<CustomerItem[]> => {
    const customers = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            img: users.img,
            orders: sql<number>`COUNT(${orders.id})`.as("orders"),
            spent: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`.as("spent"),
            createdAt: users.createdAt,
            lastOrderDate: sql<Date | null>`MAX(${orders.createdAt})`.as("lastOrderDate"),
            status: sql<string>`CASE 
                WHEN MAX(${orders.status}) = 'cancelled' THEN 'inactive'
                WHEN MAX(${orders.createdAt}) IS NULL THEN 'new'
                WHEN MAX(${orders.createdAt}) < NOW() - INTERVAL '3 months' THEN 'inactive'
                ELSE 'active'
            END`.as("status"),
        })
        .from(users)
        .leftJoin(orders, eq(users.id, orders.userId))
        .where(and(
            eq(users.storeId, storeId),
            eq(users.role, "customer"),
            filter?.query ? or(
                ilike(users.firstName, `%${filter.query}%`),
                ilike(users.lastName, `%${filter.query}%`),
            ) : undefined,
            !filter.status || filter.status === "all"
                ? undefined
                : eq(sql.identifier("status"), filter.status)
        ))
        .groupBy(
            users.id,
            users.firstName,
            users.lastName,
            users.email,
            users.img,
            users.createdAt
        )
        .orderBy(
            filter.sort === "most-orders"
                ? sql`${sql.identifier("orders")} DESC`
                : filter.sort === "highest-spent"
                    ? sql`${sql.identifier("spent")} DESC`
                    : filter.sort === "oldest"
                        ? asc(users.createdAt)
                        : filter.sort === "last-order"
                            ? sql`${sql.identifier("lastOrderDate")} DESC NULLS LAST`
                            : desc(users.createdAt)
        )
        .offset((page - 1) * 10)
        .limit(10)
        
    return customers.map(customer => ({
        ...customer,
        status: customer.status as CustomerStatus,
        lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : null
    }))
}