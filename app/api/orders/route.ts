import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { OrderSort, OrderStatus } from "@/types/order";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { getOrderItems } from "@/db/lib/order";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {
		const session = await getSession()
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})

		const storeId = await getTenantId()
		const searchParams = request.nextUrl.searchParams
		const _page = searchParams.get('page')
		const _query = searchParams.get('query')
		const _status = searchParams.get('status') as OrderStatus|undefined
		const _sort = searchParams.get('sort') as OrderSort|undefined
		const _day = searchParams.get('day') as string|undefined
		const _customerId = searchParams.get('customerId') as string|undefined


		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _orders = await getOrderItems(storeId,{
			"query":_query ?? undefined,
			"sort":_sort,
			"day":_day,
			"status":_status,
			"customerId":_customerId,
		},page)
				
		return NextResponse.json({"data":_orders})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}