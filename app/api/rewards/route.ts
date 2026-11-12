import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { RewardItem } from "@/types/reward";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { ilike, or } from "drizzle-orm";
import { rewards } from "@/db/schema";


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

		const _rewards:RewardItem[] = await db.query.rewards.findMany({
			"columns":{
				id:true,
				redeemed:true,
				name: true,
				type: true,
				description: true,
				value: true,
				pointsCost:true,
				minPurchase: true,
				expiryDays: true,
				isActive: true,
			},
			"where":(rewards,{and,eq})=>and(
				eq(rewards.storeId,storeId),
				_query ? or(
					ilike(rewards.name,`%${_query}%`),
					ilike(rewards.description,`%${_query}%`),
				) : undefined,
				session.user_role !== "seller" ? eq(rewards.isActive,true) : undefined,
			),
			"offset":(page - 1) * 10,
			"limit":10
		})
				
		return NextResponse.json({
			"data":session.user_role !== "seller" ? _rewards.map(reward=>({...reward,"redeemed":undefined,"isActive":undefined})) : _rewards
		})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}