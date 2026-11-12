import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { getAnalytics, getCustomerAnalytics, getTopProducts } from "@/db/lib/analytics";
import { AnalyticData, CustomerAnalytics } from "@/types/analytics";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {
		const session = await getSession()
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		const storeId = await getTenantId()
		if(session.user_role !== "customer") return NextResponse.json({"error":errorMsgs.NotAuthorized})
		const searchParams = request.nextUrl.searchParams
		const _range = searchParams.get('range') as "day"|"month"|"year"|undefined

		const [customerAnalytics] = await Promise.all([
			getCustomerAnalytics(
				session.user_id,
				storeId,
				["day","month","year"].includes(_range!) ? _range! : "month",
			)
		])
		const _customerAnalytics:CustomerAnalytics = customerAnalytics				
		return NextResponse.json({"data":_customerAnalytics})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}