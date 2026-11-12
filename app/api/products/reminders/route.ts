import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { ProductSort, ProductStatus } from "@/types/product";
import { ProductPriceRange } from "@/lib/product";
import { getProductItems } from "@/db/lib/product";
import { getSession } from "@/lib/auth-server";
import { db } from "@/db";
import { productStockSubscriptions } from "@/db/schema";
import { and, eq } from "drizzle-orm";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {
		const session = await getSession()
		if(!session) return NextResponse.json({"data":[]})
		
		const storeId = await getTenantId()
		const activeReminders = await db.select({"productId":productStockSubscriptions.productId})
			.from(productStockSubscriptions)
			.where(
				and(
					eq(productStockSubscriptions.storeId,storeId),
					eq(productStockSubscriptions.userId,session.user_id),
					eq(productStockSubscriptions.notified,false),
				)
			)				
		return NextResponse.json({"data":activeReminders.map(i=>i.productId)})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}