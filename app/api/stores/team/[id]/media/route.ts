import { NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { safeUnlink, saveImgFromFile } from "@/lib/utils-server";
import { teamMembers } from "@/db/schema";
import { getTenantId } from "@/lib/tenant";

export const POST = async (req:Request,{ params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id:teamMemberId } = await params;
        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated})
        const storeId = await getTenantId()
        //TODO: Do some role based auth 
        const [teamMember] = await db.select({
            "id":teamMembers.id,
            "image":teamMembers.image
        }).from(teamMembers)
            .where(
                and(
                    eq(teamMembers.id,teamMemberId),
                    eq(teamMembers.storeId,storeId)
                )
            )

        if(!teamMember) return NextResponse.json({"error":errorMsgs.NotAuthorized})


        const formData = await req.formData();
        const _image = formData.get("image") as File|undefined;


        const [img] = await Promise.all([
            saveImgFromFile(400,path.join(process.cwd(), "public","imgs","team"),`${teamMember.id}-${Math.floor(Math.random()*9999)}.webp`,_image),
        ])
        await db.update(teamMembers)
            .set({"image":img,"updatedAt":new Date()})
            .where(
                and(
                    eq(teamMembers.id,teamMemberId),
                    eq(teamMembers.storeId,storeId)
                )
            )
        await Promise.all([
            teamMember?.image && safeUnlink(path.join(process.cwd(), "public","imgs","team",teamMember.image!)),
        ])

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
