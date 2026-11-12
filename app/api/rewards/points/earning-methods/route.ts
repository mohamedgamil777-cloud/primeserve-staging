import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { PointEarningMethod } from "@/types/pointEarningMethod";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { ilike, or } from "drizzle-orm";
import { pointEarningMethods } from "@/db/schema";


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

		const _pointEarningMethods:PointEarningMethod[] = await db.query.pointEarningMethods.findMany({
			"columns":{
				id:true,
				name: true,
				description: true,
				isActive: true,
				type: true,
				frequency:true,
				totalEarned:true,
				totalPointsEarned:true,

				pointsAwarded: true,
				conditions: true,
				pointsPerDollar: true,
			},
			"where":(pointEarningMethods,{and,eq})=>and(
				eq(pointEarningMethods.storeId,storeId),
				_query ? or(
					ilike(pointEarningMethods.name,`%${_query}%`),
					ilike(pointEarningMethods.description,`%${_query}%`),
				) : undefined,
				session.user_role !== "seller" ? eq(pointEarningMethods.isActive,true) : undefined,
			),
			"offset":(page - 1) * 10,
			"limit":10
		})
				
		return NextResponse.json({
			"data":session.user_role !== "seller" ? _pointEarningMethods.map(pointEarningMethod=>({...pointEarningMethod,"redeemed":undefined,"isActive":undefined})) : _pointEarningMethods
		})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}