import { NextResponse } from "next/server";
import { db } from "@/db";
import { getSession } from "@/lib/auth-server";
import { getTenantId } from "@/lib/tenant";
import { errorMsgs } from "@/lib/error";
import { ExistingAddress } from "@/types/address";

export const GET = async (req:Request) => {
    try {
        const [storeId,session] = await Promise.all([
            getTenantId(),
            getSession()
        ]) 
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated},{"status":400})
        const _addresses:ExistingAddress[] = await db.query.addresses.findMany({
            "columns":{
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                phone: true,
                isDefault: true,
            },
            "where":(addresses,{eq,and})=> and(
                eq(addresses.storeId,storeId),
                eq(addresses.userId,session.user_id),
            ),
            "orderBy":(addresses,{desc})=>desc(addresses.createdAt)
        })

        return NextResponse.json({ data: _addresses, status: 200 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
