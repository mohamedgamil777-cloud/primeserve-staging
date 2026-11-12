import { NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { and, eq, inArray } from "drizzle-orm";
import { safeUnlink, saveImgFromFile } from "@/lib/utils-server";
import { categories, subcategories } from "@/db/schema";
import { getTenantId } from "@/lib/tenant";

export const POST = async (req:Request,{ params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id:subcategoryId } = await params;
        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
        //TODO: Do some role based auth 
        const storeId = await getTenantId()

        const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id,subcategoryId))
        const [ownsCategory] = subcategory ? await db.select().from(categories).where(
            and(
                eq(categories.id,subcategory.categoryId),
                eq(categories.storeId,storeId)
            )
        ) : []
        if(!ownsCategory) return NextResponse.json({
            "error":errorMsgs.NotAuthorized
        },{"status":400})


        const formData = await req.formData();
        const _image = formData.get("image") as File|undefined;


        const [img] = await Promise.all([
            saveImgFromFile(400,path.join(process.cwd(), "public","imgs","categories"),`${subcategoryId}-${Math.floor(Math.random()*9999)}.webp`,_image),
        ])
        await db.update(subcategories)
            .set({"image":img,"updatedAt":new Date()})
            .where(
                eq(subcategories.id,subcategoryId),
            )
        await Promise.all([
            subcategory?.image && safeUnlink(path.join(process.cwd(), "public","imgs","categories",subcategory.image!)),
        ])

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
