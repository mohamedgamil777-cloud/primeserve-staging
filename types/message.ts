import { messageCategory, messagePriority, messageStatus, selectContactMessageSchema } from "@/db/schema/messages";
import { z } from "zod";

type ExistingMessage = z.infer<typeof selectContactMessageSchema>
export type ContactMessage = Omit<ExistingMessage,"userId"|"storeId"|"updatedAt">

export type ContactMessageStatus = typeof messageStatus[number]
export type ContactMessageCategory = typeof messageCategory[number]
export type ContactMessagePriority = typeof messagePriority[number]

export type MessageFilters = {
  query?:string,
  status?:ContactMessageStatus,
  category?:ContactMessageCategory,
  priority?:ContactMessagePriority,
}


export type UpdateMessagePayload = Partial<
  Pick<ContactMessage, 'status' | 'priority' | 'isStarred' | 'adminNotes' | 'responseCount'>
> & {
  id: string
}
