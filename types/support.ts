import { z } from "zod"
import { messageCategory } from "@/db/schema/messages"

export const supportTypes = ["procurement", "facility", "hr", "technical", "finance", "general"] as const
export type SupportType = (typeof supportTypes)[number]

export const supportPriorities = ["low", "medium", "high"] as const

// English labels used in the admin message subject and body.
export const supportTypeLabels: Record<SupportType, string> = {
  procurement: "Procurement Support",
  facility: "Facility Support",
  hr: "HR & Employee Services",
  technical: "Technical Support",
  finance: "Finance & Invoices",
  general: "General Inquiry",
}

// Maps each support type to the existing admin message category.
export const supportTypeCategory: Record<SupportType, (typeof messageCategory)[number]> = {
  procurement: "order",
  facility: "service",
  hr: "service",
  technical: "technical",
  finance: "billing",
  general: "general",
}

export const supportRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  jobTitle: z.string().trim().max(120).optional(),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{8,20}$/),
  email: z.string().trim().email().max(255),
  supportType: z.enum(supportTypes),
  priority: z.enum(supportPriorities),
  branch: z.string().trim().min(2).max(160),
  details: z.string().trim().min(10).max(5000),
})

export type SupportRequest = z.infer<typeof supportRequestSchema>
