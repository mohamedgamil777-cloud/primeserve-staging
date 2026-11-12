import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { cartItems, carts, products } from "@/db/schema";
import { getTenantId } from "@/lib/tenant";

export const DELETE = async (req:Request,{ params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id:productId } = await params;
        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
        const storeId = await getTenantId()
        const _cart = await db.query.carts.findFirst({
            "columns":{"id":true},
            "where":(carts,{eq,and})=>and(
                eq(carts.storeId,storeId),
                eq(carts.userId,session.user_id)
            )
        })
        if(_cart) await db.delete(cartItems).where(and(
            eq(cartItems.cartId,_cart.id),
            eq(cartItems.productId,productId)
        ))

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};

export const PUT = async (req:Request,{ params }: { params: Promise<{ id: string }> }) => {
    try {
        const [{ id:productId },{ newQuantity }] = await Promise.all([params,req.json()]);
        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
        if(!newQuantity || isNaN(newQuantity)) return NextResponse.json({"success":true})
            
        const storeId = await getTenantId()
        const [product] = await db.select({"id":products.id,"stock":products.stock})
            .from(products)
            .where(
                and(
                    eq(products.id,productId),
                    eq(products.storeId,storeId)
                )
            )
        if(!product) return NextResponse.json({"success":true})
        const _cart = await db.query.carts.findFirst({
            "columns":{"id":true},
            "where":(carts,{eq,and})=>and(
                eq(carts.storeId,storeId),
                eq(carts.userId,session.user_id)
            )
        })
        if(_cart){
            if(newQuantity > 0) await db.update(cartItems)
                .set({
                    "quantity":product.stock ? Math.min(newQuantity,product.stock) : newQuantity
                })
                .where(and(
                    eq(cartItems.cartId,_cart.id),
                    eq(cartItems.productId,productId)
                )
            )
            else await db.delete(cartItems).where(and(
                    eq(cartItems.cartId,_cart.id),
                    eq(cartItems.productId,productId)
                )
            )
        } 
        else{
            const [newCart] = await db.insert(carts).values({"storeId":storeId,"userId":session.user_id}).returning()
            await db.insert(cartItems).values({
                "cartId":newCart.id,
                "productId":productId,
                "quantity":Math.min(1,newQuantity)
            })
        }

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
