import { selectAddressSchema } from "@/db/schema/addresses";
import { z } from "zod";

export type ExistingAddress = Omit<z.infer<typeof selectAddressSchema>,"updatedAt"|"storeId"|"createdAt"|"userId">