import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { products, wishlistItems, wishlists } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { getTenantId } from "@/lib/tenant";
import { getUserWishlist } from "@/db/lib/wishlist";
import { WishlistSort, WishlistStockFilter } from "@/types/wishlist";

export const GET = async (request:NextRequest) => {
	try {
		const [session,storeId] = await Promise.all([
			getSession(),
			getTenantId()
		])
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated},{"status":400})
		if(session.user_role === "seller" && !session.stores.includes(storeId)) return NextResponse.json({"error":errorMsgs.NotAuthorized},{"status":400})
		
		const searchParams = request.nextUrl.searchParams
		// const _page = searchParams.get('page')
		const _query = searchParams.get('query')
		const _sort = searchParams.get('sort') as WishlistSort|undefined
		const _stockFilter = searchParams.get('stockFilter') as WishlistStockFilter|undefined
		const _customerId = searchParams.get('customerId') as string|undefined
		
		const _wishList = await db.query.wishlists.findFirst({
			"where":(wishlists,{eq,and})=>and(
				eq(wishlists.storeId,storeId),
				eq(
					wishlists.userId,session.user_role === "seller" && _customerId 
					? _customerId : session.user_id
				)
			),
			"columns":{
				"id":true
			}
		})

		if(!_wishList) await db.insert(wishlists).values({
			"storeId":storeId,
			"userId":session.user_id
		})

		const userWishlist = !_wishList ? [] : await getUserWishlist({
			"wishlistId":_wishList.id,
			// "page":isNaN(Number(String(_page))) ? undefined : Number(_page),
			"query":_query ?? undefined,
			"sort":_sort,
			"inStock":_stockFilter,
			"limit":50,			
		})


		return NextResponse.json({ data: userWishlist }, {status: 200 });
	} catch (error) {
		console.log("Error occured ", error);
		return NextResponse.json({ Message: "Failed", status: 500 });
	}
};


export const DELETE = async (req:Request) => {
	try {
		const [session,storeId] = await Promise.all([
			getSession(),
			getTenantId()
		])
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated},{"status":400})
		const _wishList = await db.query.wishlists.findFirst({
			"where":(wishlists,{eq,and})=>and(
				eq(wishlists.storeId,storeId),
				eq(wishlists.userId,session.user_id)
			),
			"columns":{
				"id":true
			},
		})

		if(_wishList) await db.delete(wishlistItems).where(eq(wishlistItems.wishlistId,_wishList.id))

		return NextResponse.json({ success: true }, {status: 200 });
	} catch (error) {
		console.log("Error occured ", error);
		return NextResponse.json({ Message: "Failed", status: 500 });
	}
};

export const POST = async (req:Request) => {
	try {
		const [session,storeId] = await Promise.all([
			getSession(),
			getTenantId()
		])
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated},{"status":400})
		const { productId } = await req.json();
		const _wishList = await db.query.wishlists.findFirst({
			"where":(wishlists,{eq,and})=>and(
				eq(wishlists.storeId,storeId),
				eq(wishlists.userId,session.user_id)
			),
			"columns":{
				"id":true
			},
		})

		const [product] = (!productId) ? [undefined] : await db.select({"id":products.id,"stock":products.stock})
			.from(products)
			.where(
				and(
					eq(products.id,productId),
					eq(products.storeId,storeId)
				)
			).limit(1)
		if(!product) return NextResponse.json({"success":true})

		if(!_wishList){
			const [newWishlist] = await db.insert(wishlists).values({
				"storeId":storeId,
				"userId":session.user_id
			}).returning()
			await db.insert(wishlistItems).values({
				"wishlistId":newWishlist.id,
				"productId":product.id,
			})
		}else{
			const [item] = await db.select({id:wishlistItems.id}).from(wishlistItems).where(
				and(
					eq(wishlistItems.wishlistId,_wishList.id),
					eq(wishlistItems.productId,product.id)
				)
			)
			if(!item) await db.insert(wishlistItems).values({
				"wishlistId":_wishList.id,
				"productId":product.id,
			})
		}

		return NextResponse.json({ success: true }, {status: 200 });
	} catch (error) {
		console.log("Error occured ", error);
		return NextResponse.json({ Message: "Failed", status: 500 });
	}
};
