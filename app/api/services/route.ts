import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { getServiceItems } from "@/db/lib/service";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {

		// const session = await getSession()
		// if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		const storeId = await getTenantId()
		const searchParams = request.nextUrl.searchParams
		const _page = searchParams.get('page')
		const _query = searchParams.get('query')
		const _type = searchParams.get('type') as string|undefined
		const _categoryId = searchParams.get('categoryId')

		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _services = await getServiceItems({
			storeId,filter:{
				"categoryId":_categoryId ?? undefined,
				"query":_query ?? undefined,
				"type":_type,
			},
			page
		})		
		return NextResponse.json({"data":_services})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}