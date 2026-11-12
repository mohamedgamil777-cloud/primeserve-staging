"use server"

import { DEFAULT_TENANT_ID } from "@/consts";
import { headers } from "next/headers";

export async function getTenantId(): Promise<string> {
    // const id = (await headers()).get("x-tenant-id");
    // if (!id) throw new Error("Missing tenant ID");
    // return id;
    return DEFAULT_TENANT_ID
}