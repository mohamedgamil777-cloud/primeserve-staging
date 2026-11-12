import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { RedeemedRewardItem } from "@/types/reward";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {
		const session = await getSession()
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		const storeId = await getTenantId()
		const searchParams = request.nextUrl.searchParams
		const _page = searchParams.get('page')
		const _forCart = searchParams.get('forCart')
		const forCart = !!_forCart

		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _rewards:RedeemedRewardItem[] = await db.query.customerRewardRedemptions.findMany({
			"columns":{
				"id":true,
				"used":true,
				"redeemedAt":true,
				"expiresAt":true
			},
			"with":{
				"reward":{
					"columns":{
						"id":true,
						"name":true,
						"description":true,
						"pointsCost":true,
						"minPurchase":true,
						"type":true,
						"value":true,
					}
				},
				"order":{
					"columns":{
						"code":true,
						"createdAt":true
					}
				}
			},
			"where":(rewards,{and,eq,gt})=>and(
				eq(rewards.storeId,storeId),
				eq(rewards.customerId,session.user_id),
				forCart ? eq(rewards.used,false) : undefined,
				forCart ? gt(rewards.expiresAt,new Date()) : undefined,
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