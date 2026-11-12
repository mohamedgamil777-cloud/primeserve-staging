"use server";

import { db } from "@/db";
import { messages } from "@/db/schema/messages";
import { getSession } from "@/lib/auth-server";
import { getTenantId } from "@/lib/tenant";
import { hardSanitizeForDom, hardSanitizeIfExistsForDom } from "@/lib/utils";
import { supportRequestSchema, supportTypeCategory, supportTypeLabels, SupportRequest } from "@/types/support";

// Saves a Support Hub request into the messages table so it shows up in Admin > Messages.
export async function submitSupportRequest(values: SupportRequest) {
  try {
    const parsed = supportRequestSchema.safeParse(values)
    if (!parsed.success) return { error: "invalid request" }
    const v = parsed.data

    const [storeId, session] = await Promise.all([
      getTenantId(),
      getSession(),
    ])

    const typeLabel = supportTypeLabels[v.supportType]
    const body = [
      `Support type: ${typeLabel}`,
      `Priority: ${v.priority}`,
      `Company: ${v.company}`,
      v.jobTitle ? `Job title: ${v.jobTitle}` : null,
      `Branch / location: ${v.branch}`,
      `Mobile: ${v.phone}`,
      "",
      v.details,
    ].filter((line) => line !== null).join("\n")

    await db.insert(messages).values({
      storeId,
      userId: session?.user_id,
      name: hardSanitizeForDom(v.name),
      email: v.email,
      phone: hardSanitizeIfExistsForDom(v.phone),
      subject: hardSanitizeForDom(`[Support Hub] ${typeLabel} - ${v.company}`).slice(0, 255),
      category: supportTypeCategory[v.supportType],
      priority: v.priority,
      message: hardSanitizeForDom(body),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error saving support request:", error)
    return { error: "something went wrong, try again later." }
  }
}
