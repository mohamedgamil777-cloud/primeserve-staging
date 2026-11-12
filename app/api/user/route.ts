import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { stores, users } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { CurrentUser } from "@/types/user";

export const GET = async (req:Request) => {
    try {
        // //TODO: just for testing remove later
        // let session = await getSession()
        // if(!session) await signin({
        //     "email":"admin@test-store.codmium.com",
        //     "password":"123456789"
        // })
        // ////////////


        const session = await getSession()
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated},{"status":400})
        const [[user],_stores] = await Promise.all([
            db.select({"firstName":users.firstName,"lastName":users.lastName,"id":users.id,"img":users.img,"role":users.role})
                .from(users)
                .where(eq(users.id,session.user_id)),
            db.select({"name":stores.name,"id":stores.id,"image":stores.image,"slug":stores.slug})
                .from(stores)
                .where(inArray(stores.id,session.stores)),
        ]) 
        const currentUser:CurrentUser = {
            ...(user ?? {}),
            "stores":_stores
        }
        return NextResponse.json({ data: currentUser }, {status: 200 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
