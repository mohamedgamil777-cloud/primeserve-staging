import { eq } from "drizzle-orm"
import { db } from ".."
import { DEFAULT_TENANT_ID } from "@/consts"
import { pointEarningMethods } from "../schema"

const defaultPointEarningMethods = [
  {
    name: "Purchase Points",
    description: "Earn points for every dollar spent",
    type: "purchase" as const,
    pointsPerDollar: 1,
    isActive: true,
    totalEarned: 0,
    frequency: "unlimited"  as const,
    conditions: "Minimum $1 purchase",
  },
  {
    name: "Product Review",
    description: "Write a review for a purchased product",
    type: "review"  as const,
    pointsAwarded: 50,
    isActive: true,
    totalEarned: 0,
    frequency: "unlimited"  as const,
    conditions: "Must have purchased the product",
  },
  {
    name: "Account Creation",
    description: "Welcome bonus for new account registration",
    type: "signup"  as const,
    pointsAwarded: 100,
    isActive: true,
    totalEarned: 0,
    frequency: "once"  as const,
    conditions: "New account only",
  },
  {
    name: "Referral Bonus",
    description: "Refer a friend who makes their first purchase",
    type: "referral"  as const,
    pointsAwarded: 200,
    isActive: true,
    totalEarned: 0,
    frequency: "unlimited"  as const,
    conditions: "Friend must make a purchase",
  },
  {
    name: "Birthday Bonus",
    description: "Special points bonus on your birthday",
    type: "birthday" as const,
    pointsAwarded: 150,
    isActive: true,
    totalEarned: 0,
    frequency: "unlimited" as const,
    conditions: "Valid birthday in profile",
  },
  {
    name: "Social Media Share",
    description: "Share a product on social media",
    type: "social" as const,
    pointsAwarded: 25,
    isActive: false,
    totalEarned: 0,
    frequency: "unlimited" as const,
    conditions: "Must be public post",
  },
]

export async function seedPointEarningMethods() {
  const count = (await db.select({"id":pointEarningMethods.id}).from(pointEarningMethods)
    .where(eq(pointEarningMethods.storeId,DEFAULT_TENANT_ID))).length
  if(count === 0){
      await db.insert(pointEarningMethods).values(defaultPointEarningMethods.map(pointEarningMethod=>({...pointEarningMethod,"storeId":DEFAULT_TENANT_ID})))
  }
}