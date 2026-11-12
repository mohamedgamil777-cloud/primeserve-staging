import { eq } from "drizzle-orm"
import { promotionCodes } from "../schema"
import { DEFAULT_TENANT_ID } from "@/consts"
import { db } from ".."

const mockPromotions = [
  {
    code: "SUMMER25",
    type: "percentage" as const,
    value: 25,
    description: "Summer sale discount",
    minPurchase: 50,
    usageLimit: 1000,
    usageCount: 423,
    startDate: new Date("2025-05-01T00:00:00Z"),
    endDate: new Date("2025-08-31T23:59:59Z"),
    isActive: true,
  },
  {
    code: "FREESHIP",
    type: "shipping" as const,
    value: 0,
    description: "Free shipping on all orders",
    minPurchase: 75,
    usageLimit: 500,
    usageCount: 289,
    startDate: new Date("2025-05-15T00:00:00Z"),
    endDate: new Date("2025-06-15T23:59:59Z"),
    isActive: true,
  },
  {
    code: "WELCOME10",
    type: "percentage" as const,
    value: 10,
    description: "New customer discount",
    minPurchase: 0,
    usageLimit: null,
    usageCount: 1245,
    startDate: new Date("2025-01-01T00:00:00Z"),
    endDate: null,
    isActive: true,
  },
  {
    code: "FLASH50",
    type: "percentage" as const,
    value: 50,
    description: "Flash sale discount",
    minPurchase: 100,
    usageLimit: 200,
    usageCount: 200,
    startDate: new Date("2025-04-01T00:00:00Z"),
    endDate: new Date("2025-04-02T23:59:59Z"),
    isActive: false,
  },
  {
    code: "HOLIDAY20",
    type: "percentage" as const,
    value: 20,
    description: "Holiday season discount",
    minPurchase: 50,
    usageLimit: 1000,
    usageCount: 0,
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    isActive: true,
  },
  {
    code: "FIXED25",
    type: "fixed" as const,
    value: 25,
    description: "$25 off your purchase",
    minPurchase: 100,
    usageLimit: 500,
    usageCount: 127,
    startDate: new Date("2025-05-01T00:00:00Z"),
    endDate: new Date("2025-07-31T23:59:59Z"),
    isActive: true,
  },
]


export async function seedPromotionCodes() {
  const count = (await db.select({"id":promotionCodes.id}).from(promotionCodes)
    .where(eq(promotionCodes.storeId,DEFAULT_TENANT_ID))).length
  if(count === 0){
      await db.insert(promotionCodes).values(mockPromotions.map(reward=>({...reward,"storeId":DEFAULT_TENANT_ID})))
  }
}