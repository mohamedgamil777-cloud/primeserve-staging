import { eq } from "drizzle-orm"
import { db } from ".."
import { tiers } from "../schema"
import { DEFAULT_TENANT_ID } from "@/consts"

const defaultTiers = [
  {
    name: "Bronze",
    color: "#CD7F32",
    minPoints: 0,
    maxPoints: 999,
    benefits: ["1x points on purchases", "Birthday discount"],
    pointsMultiplier: 1,
    memberCount: 0,
    isActive: true,
    description: "Entry level tier for new members",
  },
  {
    name: "Silver",
    color: "#C0C0C0",
    minPoints: 1000,
    maxPoints: 2999,
    benefits: ["1.25x points on purchases", "Free shipping on orders $50+", "Birthday discount"],
    pointsMultiplier: 1.25,
    memberCount: 0,
    isActive: true,
    description: "Enhanced benefits for loyal customers",
  },
  {
    name: "Gold",
    color: "#FFD700",
    minPoints: 3000,
    maxPoints: 9999,
    benefits: ["1.5x points on purchases", "Free shipping on all orders", "Early access to sales", "Birthday discount"],
    pointsMultiplier: 1.5,
    memberCount: 0,
    isActive: true,
    description: "Premium tier with exclusive perks",
  },
  {
    name: "Platinum",
    color: "#E5E4E2",
    minPoints: 10000,
    maxPoints: null,
    benefits: [
      "2x points on purchases",
      "Free shipping on all orders",
      "Early access to sales",
      "Exclusive products",
      "Personal shopper",
      "Birthday discount",
    ],
    pointsMultiplier: 2,
    memberCount: 0,
    isActive: true,
    description: "Ultimate tier for VIP customers",
  },
]

export async function seedTiers() {
    const count = (await db.select({"id":tiers.id}).from(tiers)
      .where(eq(tiers.storeId,DEFAULT_TENANT_ID))).length
    if(count === 0){
        await db.insert(tiers).values(defaultTiers.map(tier=>({...tier,"storeId":DEFAULT_TENANT_ID})))
    }
}