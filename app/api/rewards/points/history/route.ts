import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { CustomerPointLog } from "@/types/customerPointLogs";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {
		const session = await getSession()
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		const storeId = await getTenantId()
		const searchParams = request.nextUrl.searchParams
		const _page = searchParams.get('page')
		const _query = searchParams.get('query')


		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _pointEarningHistory:CustomerPointLog[] = await db.query.customerPointLogs.findMany({
			"with":{
				"reward":{
					"columns":{
						"id":true,
						"name":true,
					}
				},
				"method":{
					"columns":{
						"id":true,
						"name":true,
					}
				}
			},
			"columns":{
				id:true,
				points: true,
				type:true,
				createdAt:true,
			},
			"where":(customerPointLogs,{and,eq})=>and(
				eq(customerPointLogs.storeId,storeId),
				session.user_role !== "seller" ? eq(customerPointLogs.customerId,session.user_id) : undefined,
			),
			"offset":(page - 1) * 10,
			"limit":10
		})
				
		return NextResponse.json({
			"data":_pointEarningHistory
		})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}