import { NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { and, eq, inArray } from "drizzle-orm";
import { safeUnlink, saveImgFromFile } from "@/lib/utils-server";
import { serviceImages, services } from "@/db/schema";
import { getTenantId } from "@/lib/tenant";
import { ImageItem } from "@/components/image-gallery-selector";

export const POST = async (req:Request,{ params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id:serviceId } = await params;
        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
        const storeId = await getTenantId()
        //TODO: Do some role based auth 

        const [service] = await db.select({
            "id":services.id,
        }).from(services)
            .where(
                and(
                    eq(services.id,serviceId),
                    eq(services.storeId,storeId)
                )
            )

        if(!service) return NextResponse.json({"error":errorMsgs.NotAuthorized})


        const formData = await req.formData();
        const _meta = formData.get("meta") as string|undefined
        const _images = formData.getAll("images[]") as File[]|undefined;
        const _deletedImages = formData.getAll("deletedImages[]") as string[]|undefined;

        if((_deletedImages ?? []).length > 0){
            await db.delete(serviceImages)
                .where(inArray(serviceImages.id,_deletedImages!)).returning()
        } 

        await Promise.all(
            (_deletedImages ?? [])
                .map(async img=> await safeUnlink(path.join(process.cwd(), "public","imgs","services",img)))
            )


        const meta = _meta ? (JSON.parse(_meta) as (ImageItem & {"sortOrder":number})[]) : undefined        
        if(!meta || !_images || _images.length === 0) return NextResponse.json({"success":true})
        const imgs = await Promise.all(
            _images.map(async (img,idx)=>{
                return {
                    "sortOrder":meta.at(idx)?.sortOrder ?? 0,
                    "src":await saveImgFromFile(400,path.join(process.cwd(), "public","imgs","services"),`${serviceId}-${Math.floor(Math.random()*9999)}.webp`,img),
                }
            })
        )

        await db.insert(serviceImages).values(
            imgs.filter(img=>!!img.src).map(img=>({
                ...img,
                "src":img.src!,
                "serviceId":serviceId
            }))
        )

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
