import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { PromotionCodeStatus } from "@/types/promotionCode";
import { getPromotionCodes } from "@/db/lib/promotionCode";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {
		const session = await getSession()
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		const storeId = await getTenantId()
		if(session.user_role !== "seller" || !session.stores.includes(storeId)) return NextResponse.json({"error":errorMsgs.NotAuthorized})
		
		const searchParams = request.nextUrl.searchParams
		const _page = searchParams.get('page')
		const _query = searchParams.get('query')
		const _status = searchParams.get('status') as PromotionCodeStatus|undefined


		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _orders = await getPromotionCodes(storeId,{
			"query":_query ?? undefined,
			"status":_status,
		},page)
				
		return NextResponse.json({"data":_orders})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}