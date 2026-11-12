import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { getAnalytics, getTopProducts } from "@/db/lib/analytics";
import { AnalyticData } from "@/types/analytics";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {
		const session = await getSession()
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		const storeId = await getTenantId()
		if(!(session.user_role === "seller" && session.stores.includes(storeId))) return NextResponse.json({"error":errorMsgs.NotAuthorized})
		const searchParams = request.nextUrl.searchParams
		const _range = searchParams.get('range') as "day"|"month"|"year"|undefined

		const [current,previous,topProducts] = await Promise.all([
			getAnalytics(
				storeId,
				["day","month","year"].includes(_range!) ? _range! : "month",
				"current"
			),
			getAnalytics(
				storeId,
				["day","month","year"].includes(_range!) ? _range! : "month",
				"previous"
			),
			getTopProducts(storeId,["day","month","year"].includes(_range!) ? _range! : "month")
		])
		const _analytics:AnalyticData = {
			current,previous,topProducts
		}				
		return NextResponse.json({"data":_analytics})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}