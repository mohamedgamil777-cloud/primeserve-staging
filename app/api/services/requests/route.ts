import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { getServiceRequestItems } from "@/db/lib/serviceRequest";
import { ServiceRequestStatus, ServiceRequestUrgency } from "@/types/serviceRequest";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {
		const session = await getSession()
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		if(session.user_role !== "seller") return NextResponse.json({"error":errorMsgs.NotAuthorized})
		const storeId = await getTenantId()
		const searchParams = request.nextUrl.searchParams
		const _page = searchParams.get('page')
		const _status = searchParams.get('status') as ServiceRequestStatus|undefined
		const _urgency = searchParams.get('urgency') as ServiceRequestUrgency|undefined

		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _services = await getServiceRequestItems({
			storeId,filter:{
				"status":_status,
				"urgency":_urgency
			},
			page
		})		
		return NextResponse.json({"data":_services})
	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}