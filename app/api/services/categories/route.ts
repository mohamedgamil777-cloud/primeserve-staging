import { NextResponse } from "next/server";
import { db } from "@/db";
import { getTenantId } from "@/lib/tenant";
import { DetailedServiceCategory } from "@/types/serviceCategory";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { serviceCategories, services } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const GET = async (req:Request) => {
    try {
        const [storeId,session] = await Promise.all([
            getTenantId(),
            getSession()
        ]) 
        if(session?.user_role !== "seller") return NextResponse.json({"error":errorMsgs.NotAuthorized})
    
        const _categories:DetailedServiceCategory[] = await db
            .select({
                "isActive":serviceCategories.isActive,
                "isFeatured":serviceCategories.isFeatured,
                "slug":serviceCategories.slug,
                id: serviceCategories.id,
                nameI18n: serviceCategories.nameI18n,
                image: serviceCategories.image,
                descriptionI18n: serviceCategories.descriptionI18n,
                longDescriptionI18n: serviceCategories.longDescriptionI18n,
                icon: serviceCategories.icon,
                createdAt: serviceCategories.createdAt,
                servicesCount: sql<number>`COUNT(${services.id})`.as('servicesCount'),
            })
            .from(serviceCategories)
            .where(eq(serviceCategories.storeId,storeId))
            .leftJoin(services, sql`${services.categoryId} = ${serviceCategories.id}`)
            .groupBy(serviceCategories.id)
            .orderBy(serviceCategories.nameI18n);

        return NextResponse.json({ data: _categories, status: 200 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
