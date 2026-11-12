import { eq } from "drizzle-orm";
import { db } from "..";
import { additionalServiceOptions, serviceImages, services } from "../schema";
import { DEFAULT_TENANT_ID } from "@/consts";
import { slugify } from "@/lib/utils";



const mockServices = [
  {
    name: "TV Wall Mounting",
    categoryId: "7e1e1a5c-8e5a-4d61-b57d-08dcb165e8f3",
    type: "Installation",
    pricingModel: "fixed" as const,
    price: 149,
    duration: "2-3 hours",
    isActive: true,
    bookings: 234,
    revenue: 34686,
    rating: 4.9
  },
  {
    name: "Phone Screen Repair",
    categoryId: "83d8b041-9611-4a2a-aeb7-c24a197e7f98",
    type: "Repair",
    pricingModel: "fixed" as const,
    price: 89,
    duration: "1 hour",
    isActive: true,
    bookings: 567,
    revenue: 50463,
    rating: 4.8
  },
  {
    name: "AC System Maintenance",
    categoryId: "6f90f066-542b-4e36-9885-406671c2e08e",
    type: "Maintenance",
    pricingModel: "quote" as const,
    price: null,
    duration: "Varies",
    isActive: true,
    bookings: 89,
    revenue: 125000,
    rating: 4.7
  },
  {
    name: "Home Theater Setup",
    categoryId: "7e1e1a5c-8e5a-4d61-b57d-08dcb165e8f3",
    type: "Installation",
    pricingModel: "quote" as const,
    price: null,
    duration: "4-8 hours",
    isActive: true,
    bookings: 156,
    revenue: 234000,
    rating: 4.9
  },
  {
    name: "Laptop Repair",
    categoryId: "e7796bc8-8607-4199-985b-2a34e8a7766e",
    type: "Repair",
    pricingModel: "fixed" as const,
    price: 120,
    duration: "2-4 hours",
    isActive: false,
    bookings: 45,
    revenue: 5400,
    rating: 4.6
  }
]

const shard = {
    images: [
    "/placeholder.png?height=400&width=600",
    "/placeholder.png?height=400&width=600",
    "/placeholder.png?height=400&width=600",
  ],
  features: [
    "Professional wall stud mounting",
    "Complete cable management and hiding",
    "Tilt and swivel adjustment setup",
    "Safety and stability verification",
    "Clean-up and debris removal",
    "90-day installation warranty",
  ],
  requirements: [
    "TV size up to 75 inches",
    "Drywall or concrete wall",
    "Access to power outlet",
    "Clear workspace around mounting area",
  ],
  whatsIncluded: [
    "Professional installation",
    "All mounting hardware",
    "Cable management kit",
    "Safety inspection",
    "90-day warranty",
  ],
  additionalServices: [
    { name: "Sound bar mounting", price: 49 },
    { name: "Cable box installation", price: 29 },
    { name: "Universal remote setup", price: 39 },
  ],
}

export async function seedServices() {
    const count = (await db.select({"id":services.id}).from(services)
      .where(eq(services.storeId,DEFAULT_TENANT_ID))).length
    if(count === 0){
      console.log("Mock Services Don't exist, adding the mock services ....")
      const newServices = await db.insert(services).values(
        mockServices.map(cat=>({
          ...cat,
          "shortDescription": "Professional TV mounting service with complete cable management and safety installation",
          "longDescription":"Our expert technicians provide professional TV wall mounting services for all TV sizes and wall types. We ensure your TV is securely mounted with proper cable management for a clean, professional look. All installations include safety checks and come with our satisfaction guarantee.",
          "slug":slugify(cat.name),
          "storeId":DEFAULT_TENANT_ID,
          "createdAt":new Date(),
          features:shard.features,
          requirements:shard.requirements,
          inclusions:shard.whatsIncluded,
        }))
      ).returning()
      for(const service of newServices){
        await db.insert(serviceImages).values(shard.images.map((img,idx)=>({
          "src":"",
          "sortOrder":idx,
          "serviceId":service.id
        })))
        await db.insert(additionalServiceOptions).values(shard.additionalServices.map(addOn=>({
          "name":addOn.name,
          "serviceId":service.id,
          "price":addOn.price
        })))
      }
    }
}