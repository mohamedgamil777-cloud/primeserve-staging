import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { ContactMessage, ContactMessageCategory, ContactMessagePriority, ContactMessageStatus } from "@/types/message";
import { db } from "@/db";


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
		const _status = searchParams.get('status') as ContactMessageStatus|undefined
		const _priority = searchParams.get('priority') as ContactMessagePriority|undefined
		const _category = searchParams.get('category') as ContactMessageCategory|undefined


		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _messeges:ContactMessage[] = await db.query.messages.findMany({
			"columns":{
				id: true,
				name: true,
				email: true,
				phone: true,
				subject: true,
				category: true,
				message: true,
				status: true,
				priority: true,
				isStarred: true,
				adminNotes: true,
				responseCount: true,
				createdAt: true,
			},
			"limit":10,
			"offset":(page - 1) * 10,
			"where":(messages,{and,eq,or,ilike})=>and(
				eq(messages.storeId,storeId),
				_query ? or(
					ilike(messages.name,`%${_query}%`),
					ilike(messages.subject,`%${_query}%`),
					ilike(messages.message,`%${_query}%`),
					ilike(messages.adminNotes,`%${_query}%`),
					ilike(messages.email,`%${_query}%`),
					ilike(messages.phone,`%${_query}%`),
				) : undefined,
				_status ? eq(messages.status,_status) : undefined,
				_priority ? eq(messages.priority,_priority) : undefined,
				_category ? eq(messages.category,_category) : undefined,
			)
		})
				
		return NextResponse.json({"data":_messeges})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}