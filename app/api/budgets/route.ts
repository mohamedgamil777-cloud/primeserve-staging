import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getTenantId } from "@/lib/tenant";
import { errorMsgs } from "@/lib/error";
import { DetailedBudget } from "@/types/budget";
import { getCustomerBudgets } from "@/db/lib/budget";

export const GET = async (req:Request) => {
    try {
        const [storeId,session] = await Promise.all([
            getTenantId(),
            getSession()
        ]) 
        if(!session) return NextResponse.json({"error":errorMsgs.NotAuthenticated},{"status":400})
        const _budgets:DetailedBudget[] = await getCustomerBudgets(session.user_id,storeId)
        return NextResponse.json({ data: _budgets, status: 200 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
