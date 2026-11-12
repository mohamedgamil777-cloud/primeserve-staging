import { NextResponse } from "next/server";
import { db } from "@/db";
import { DetailedCategory } from "@/types/category";
import { getSession } from "@/lib/auth-server";
import { getTenantId } from "@/lib/tenant";
import { errorMsgs } from "@/lib/error";

export const GET = async (req:Request) => {
    try {
        const [storeId,session] = await Promise.all([
            getTenantId(),
            getSession()
        ]) 
        // if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated},{"status":400})
        // const _categories:DetailedCategory[] = session?.stores.includes(storeId) 
        //     ? 
        //     await db.query.categories.findMany({
        //         "where":(categories,{eq,and})=> and(
        //             eq(categories.storeId,storeId),
        //         ),
        //         "with":{
        //             "subcategories":true
        //         }
        //     })
        //     :
        //     []
        const _categories:DetailedCategory[] = await db.query.categories.findMany({
            "where":(categories,{eq,and})=> and(
                eq(categories.storeId,storeId),
            ),
            "with":{
                "subcategories":true
            }
        })

        return NextResponse.json({ data: _categories, status: 200 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
