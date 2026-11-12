import { NextResponse } from "next/server";
import { db } from "@/db";
import { and, eq, inArray } from "drizzle-orm";
import { cartItems, carts, products } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { getTenantId } from "@/lib/tenant";
import { DetailedCartItem } from "@/types/cart";

export const GET = async (req:Request) => {
	try {
		const [session,storeId] = await Promise.all([
			getSession(),
			getTenantId()
		])
		if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated},{"status":400})
		const _cart = await db.query.carts.findFirst({
			"where":(carts,{eq,and})=>and(
				eq(carts.storeId,storeId),
				eq(carts.userId,session.user_id)
			),
			"columns":{
				"id":true
			},
			"with":{
				"items":{
					"columns":{
						"id":true,
						"quantity":true,
					},
					"with":{
						"product":{
							"columns":{
								"id":true,
								"nameI18n":true,
								"mainImage":true,
								"price":true,
								"discountPercentage":true,
								"stock":true
							},
							"with":{
								"category":{
									"columns":{
										"nameI18n":true
									}
								},
							}
						}
					}
				}
			}
		})

		if(!_cart) await db.insert(carts).values({
			"storeId":storeId,
			"userId":session.user_id
		})

		const userCart = !_cart ? [] : _cart.items

		//Update quantity if needed
		for(const cartItem of userCart){
			if(cartItem.quantity > (cartItem.product.stock ?? 0)){
				cartItem.quantity = (cartItem.product.stock ?? 0)
				if(cartItem.quantity === 0) await db.delete(cartItems).where(eq(cartItems.id,cartItem.id))
				else await db.update(cartItems).set({"quantity":cartItem.quantity}).where(eq(cartItems.id,cartItem.id))
			}
		}
		const filteredUserCart:DetailedCartItem[] = userCart.filter(item=>item.quantity > 0)

		return NextResponse.json({ data: filteredUserCart }, {status: 200 });
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
		const _cart = await db.query.carts.findFirst({
			"where":(carts,{eq,and})=>and(
				eq(carts.storeId,storeId),
				eq(carts.userId,session.user_id)
			),
			"columns":{
				"id":true
			},
		})

		if(_cart) await db.delete(cartItems).where(eq(cartItems.cartId,_cart.id))

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
		const { products:productsToAdd } = await req.json() as {products:{productId:string, quantity:number}[]};
		const _cart = await db.query.carts.findFirst({
			"where":(carts,{eq,and})=>and(
				eq(carts.storeId,storeId),
				eq(carts.userId,session.user_id)
			),
			"columns":{
				"id":true
			},
		})

		const _products = await db.select({"id":products.id,"stock":products.stock})
			.from(products)
			.where(
				and(
					inArray(products.id,productsToAdd.map(p=>p.productId)),
					eq(products.storeId,storeId)
				)
			)

		if(!_cart){
			const [newCart] = await db.insert(carts).values({
				"storeId":storeId,
				"userId":session.user_id
			}).returning()
			await db.insert(cartItems).values(
				_products.map(p=>(
					{
						"cartId":newCart.id,
						"productId":p.id,
						"quantity":p.stock ? Math.min(p.stock,productsToAdd.find(pta=>pta.productId === p.id)?.quantity ?? 1) : (productsToAdd.find(pta=>pta.productId === p.id)?.quantity ?? 1)
					}
				))
			)
		}else{
			const _items = await db.select({id:cartItems.id,"productId":cartItems.productId}).from(cartItems).where(
				and(
					eq(cartItems.cartId,_cart.id),
					inArray(cartItems.productId,_products.map(i=>i.id))
				)
			)
			for(const item of _items){
				await db.update(cartItems).set({"quantity":productsToAdd.find(pta=>pta.productId === item.productId)?.quantity ?? 1}).where(
					eq(cartItems.id,item.id)
				)
			}
			for(const product of _products.filter(p=>!_items.find(i=>i.productId === p.id))){
				await db.insert(cartItems).values({
					"cartId":_cart.id,
					"productId":product.id,
					"quantity":productsToAdd.find(pta=>pta.productId === product.id)?.quantity ?? 1
				})
			}
		}

		return NextResponse.json({ success: true }, {status: 200 });
	} catch (error) {
		console.log("Error occured ", error);
		return NextResponse.json({ Message: "Failed", status: 500 });
	}
};
