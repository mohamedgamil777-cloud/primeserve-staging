import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { CustomerSort, CustomerStatus } from "@/types/customer";
import { getCustomerItems } from "@/db/lib/customer";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {

		const [session,storeId] = await Promise.all([
			getSession(),
			getTenantId(),
		]) 
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		if(session.user_role !== "seller" || !session.stores.includes(storeId)) return NextResponse.json({"error":errorMsgs.NotAuthorized})
		const searchParams = request.nextUrl.searchParams
		const _page = searchParams.get('page')
		const _query = searchParams.get('query')
		const _status = searchParams.get('status') as CustomerStatus|undefined
		const _sort = searchParams.get('sort') as CustomerSort|undefined


		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _customers = await getCustomerItems(storeId,{
			"query":_query ?? undefined,
			"sort":_sort,
			"status":_status,
		},page)
				
		return NextResponse.json({"data":_customers})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}