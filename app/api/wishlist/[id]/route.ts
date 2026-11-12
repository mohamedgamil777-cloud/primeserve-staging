import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { wishlistItems } from "@/db/schema";
import { getTenantId } from "@/lib/tenant";

export const DELETE = async (req:Request,{ params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id:productId } = await params;
        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
        const storeId = await getTenantId()
        const _wishlist = await db.query.wishlists.findFirst({
            "columns":{"id":true},
            "where":(wishlists,{eq,and})=>and(
                eq(wishlists.storeId,storeId),
                eq(wishlists.userId,session.user_id)
            )
        })
        if(_wishlist) await db.delete(wishlistItems).where(and(
            eq(wishlistItems.wishlistId,_wishlist.id),
            eq(wishlistItems.productId,productId)
        ))

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
