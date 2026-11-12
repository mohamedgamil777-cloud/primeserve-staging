import { NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { and, eq, inArray } from "drizzle-orm";
import { safeUnlink, saveImgFromFile } from "@/lib/utils-server";
import { products } from "@/db/schema";
import { getTenantId } from "@/lib/tenant";

export const POST = async (req:Request,{ params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id:productId } = await params;
        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
        const storeId = await getTenantId()
        //TODO: Do some role based auth 

        const [product] = await db.select({
            "id":products.id,
            "image":products.mainImage
        }).from(products)
            .where(
                and(
                    eq(products.id,productId),
                    eq(products.storeId,storeId)
                )
            )

        if(!product) return NextResponse.json({"error":errorMsgs.NotAuthorized})


        const formData = await req.formData();
        const _image = formData.get("image") as File|undefined;


        const [img] = await Promise.all([
            saveImgFromFile(400,path.join(process.cwd(), "public","imgs","products"),`${productId}-${Math.floor(Math.random()*9999)}.webp`,_image),
        ])
        await db.update(products)
            .set({"mainImage":img,"updatedAt":new Date()})
            .where(
                and(
                    eq(products.id,productId),
                    eq(products.storeId,storeId)
                )
            )
        await Promise.all([
            product?.image && safeUnlink(path.join(process.cwd(), "public","imgs","products",product.image!)),
        ])

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
