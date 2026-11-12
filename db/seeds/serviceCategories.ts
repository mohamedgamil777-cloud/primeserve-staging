import { eq } from "drizzle-orm";
import { db } from "..";
import { serviceCategories } from "../schema";
import { DEFAULT_TENANT_ID } from "@/consts";

const mockCategories = [
  {
    id: "7e1e1a5c-8e5a-4d61-b57d-08dcb165e8f3",
    name: "TV & Audio",
    slug: "tv_audio",
    description: "Television mounting, sound system installation, and audio equipment services",
    icon: "Tv",
    isActive: true,
    serviceCount: 12,
    createdAt: "2024-01-15"
  },
  {
    id: "83d8b041-9611-4a2a-aeb7-c24a197e7f98",
    name: "Mobile Devices",
    slug: "mobile_devices",
    description: "Smartphone and tablet repair, screen replacement, and device maintenance",
    icon: "Smartphone",
    isActive: true,
    serviceCount: 8,
    createdAt: "2024-01-10"
  },
  {
    id: "37612d13-72cf-42fc-a0a4-c9fdf18f3f32",
    name: "Gaming",
    slug: "gaming",
    description: "Console repair, gaming setup installation, and gaming equipment services",
    icon: "Gamepad2",
    isActive: true,
    serviceCount: 6,
    createdAt: "2024-01-08"
  },
  {
    id: "e7796bc8-8607-4199-985b-2a34e8a7766e",
    name: "Computers",
    slug: "computers",
    description: "Computer repair, laptop maintenance, and hardware installation services",
    icon: "Laptop",
    isActive: true,
    serviceCount: 15,
    createdAt: "2024-01-05"
  },
  {
    id: "6f90f066-542b-4e36-9885-406671c2e08e",
    name: "HVAC",
    slug: "hvac",
    description: "Air conditioning installation, maintenance, and repair services",
    icon: "Settings",
    isActive: false,
    serviceCount: 4,
    createdAt: "2024-01-01"
  }
]

export async function seedServiceCategories() {
    const count = (await db.select({"id":serviceCategories.id}).from(serviceCategories)
      .where(eq(serviceCategories.storeId,DEFAULT_TENANT_ID))).length
    if(count === 0){
      console.log("Mock Service Categories Don't exist, adding the mock service categories....")
      await db.insert(serviceCategories).values(
        mockCategories.map(cat=>({
          ...cat,
          "storeId":DEFAULT_TENANT_ID,
          "createdAt":new Date()
        }))
      )
    }
}