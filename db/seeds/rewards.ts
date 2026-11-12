import { eq } from "drizzle-orm"
import { db } from ".."
import { rewards } from "../schema"
import { DEFAULT_TENANT_ID } from "@/consts"

const defaultRewards = [
  {
    name: "$5 Off Next Purchase",
    description: "Get $5 off your next order of $25 or more",
    pointsCost: 500,
    type: "discount" as const,
    value: 5,
    isActive: true,
    redeemed: 1247,
    minPurchase: 25,
    expiryDays: 30,
  },
  {
    name: "Free Shipping",
    description: "Free standard shipping on any order",
    pointsCost: 200,
    type: "shipping" as const,
    value: 0,
    isActive: true,
    redeemed: 892,
    minPurchase: 0,
    expiryDays: 14,
  },
  {
    name: "$10 Off Next Purchase",
    description: "Get $10 off your next order of $50 or more",
    pointsCost: 1000,
    type: "discount" as const,
    value: 10,
    isActive: true,
    redeemed: 634,
    minPurchase: 50,
    expiryDays: 30,
  },
  {
    name: "Early Access to Sales",
    description: "Get 24-hour early access to all sales and promotions",
    pointsCost: 300,
    type: "access" as const,
    value: 0,
    isActive: true,
    redeemed: 423,
    minPurchase: 0,
    expiryDays: 90,
  },
  {
    name: "$25 Off Next Purchase",
    description: "Get $25 off your next order of $100 or more",
    pointsCost: 2500,
    type: "discount" as const,
    value: 25,
    isActive: false,
    redeemed: 156,
    minPurchase: 100,
    expiryDays: 30,
  },
]

export async function seedRewards() {
    const count = (await db.select({"id":rewards.id}).from(rewards)
      .where(eq(rewards.storeId,DEFAULT_TENANT_ID))).length
    if(count === 0){
        await db.insert(rewards).values(defaultRewards.map(reward=>({...reward,"storeId":DEFAULT_TENANT_ID})))
    }
}