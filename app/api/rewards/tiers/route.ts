import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { TierItem } from "@/types/tier";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { ilike, or } from "drizzle-orm";
import { tiers } from "@/db/schema";


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

		const _tiers:TierItem[] = await db.query.tiers.findMany({
			"columns":{
  				id:true,
				name: true,
				description: true,
				isActive: true,
				memberCount: true,

				color: true,
				minPoints: true,
				maxPoints: true,
				benefits: true,
				pointsMultiplier: true,

			},
			"where":(tiers,{and,eq})=>and(
				eq(tiers.storeId,storeId),
				_query ? or(
					ilike(tiers.name,`%${_query}%`),
					ilike(tiers.description,`%${_query}%`),
				) : undefined,
				session.user_role !== "seller" ? eq(tiers.isActive,true) : undefined,
			),
			"offset":(page - 1) * 10,
			"limit":10
		})
				
		return NextResponse.json({
			"data":session.user_role !== "seller" ? _tiers.map(tier=>({...tier,"isActive":undefined,"memberCount":undefined})) : _tiers
		})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}