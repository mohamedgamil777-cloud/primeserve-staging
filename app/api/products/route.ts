import { NextRequest, NextResponse } from "next/server";
import { getTenantId } from "@/lib/tenant";
import { ProductSort, ProductStatus } from "@/types/product";
import { ProductPriceRange } from "@/lib/product";
import { getProductItems } from "@/db/lib/product";


export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
	try {

		// const session = await getSession()
		// if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
		const storeId = await getTenantId()
		const searchParams = request.nextUrl.searchParams
		const _page = searchParams.get('page')
		const _query = searchParams.get('query')
		const _status = searchParams.get('status') as ProductStatus|undefined
		const _sort = searchParams.get('sort') as ProductSort|undefined
		const _priceRange = searchParams.get('priceRange') as ProductPriceRange|undefined
		const _categoryId = searchParams.get('categoryId')
		const _categoryIds = searchParams.get('categoryIds')
		const _subcategoryIds = searchParams.get('subcategoryIds')
		const categoryIds = _categoryIds ? _categoryIds.split(",") : undefined
		const subcategoryIds = _subcategoryIds ? _subcategoryIds.split(",") : undefined


		const page = isNaN(Number(_page)) || Number(_page) < 1 ? 1 : Number(_page) 

		const _products = await getProductItems(storeId,{
			"categoryId":_categoryId ?? undefined,
			"categoryIds":categoryIds,
			"subcategoryIds":subcategoryIds,
			"priceRange":_priceRange,
			"query":_query ?? undefined,
			"sort":_sort,
			"status":_status,
		},page)
				
		return NextResponse.json({"data":_products})

	} catch (error) {
		console.log(error)
		return NextResponse.json({"error":"something went wrong, try again later"},{"status":500})
	}
}