import { NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { safeUnlink, saveImgFromFile } from "@/lib/utils-server";
import { storeAssets, teamMembers } from "@/db/schema";
import { getTenantId } from "@/lib/tenant";

export const POST = async (req:Request) => {
    try {
        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
        const storeId = await getTenantId()
        if(session.user_role !== "seller" || !session.stores.includes(storeId)) return NextResponse.json({"error":errorMsgs.NotAuthorized})

        const formData = await req.formData();
        const _image = formData.get("image") as File|undefined;

        if(!_image) return NextResponse.json({"success":true})
        const _storeAssets = await db.query.storeAssets.findFirst({
            "where":(storeAssets,{eq})=>eq(storeAssets.storeId,storeId),
            "columns":{
                "heroBackgroundImage":true
            }  
        })
        if(!_storeAssets) await db.insert(storeAssets).values({
            storeId,
            "createdAt":new Date(),
            "updatedAt": new Date(),
        })

        const [img] = await Promise.all([
            saveImgFromFile(900,path.join(process.cwd(), "public","imgs","stores"),`hero-${storeId}-${Math.floor(Math.random()*9999)}.webp`,_image),
        ])
        await db.update(storeAssets)
            .set({"heroBackgroundImage":img,"updatedAt":new Date()})
            .where(eq(storeAssets.storeId,storeId))
        await Promise.all([
            _storeAssets?.heroBackgroundImage && safeUnlink(path.join(process.cwd(), "public","imgs","stores",_storeAssets.heroBackgroundImage!)),
        ])

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
