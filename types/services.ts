import { selectAdditionalServiceOptionSchema } from "@/db/schema/additionalServiceOptions"
import { selectServiceImageSchema } from "@/db/schema/serviceImages"
import { selectServiceSchema } from "@/db/schema/services"
import { z } from "zod"
import { ExistingServiceCategory } from "./serviceCategory"

export type ExistingService = Omit<z.infer<typeof selectServiceSchema>,"updatedAt"|"createdAt"|"storeId"|"rating"|"reviewCount"> & {
  "addOns":z.infer<typeof selectAdditionalServiceOptionSchema>[],
  "images":z.infer<typeof selectServiceImageSchema>[],
}

export type ServiceItem = Pick<z.infer<typeof selectServiceSchema>,"id"|"nameI18n"|"type"|"price"|"pricingModel"|"estimatedDuration"|"rating"|"isActive"> & {
  "category":Pick<ExistingServiceCategory,"id"|"nameI18n">
}

export type ServicePublicItem = Pick<z.infer<typeof selectServiceSchema>,"id"|"nameI18n"|"price"|"pricingModel"|"estimatedDuration"|"type"|"shortDescriptionI18n"|"rating"|"isActive"|"reviewCount"|"features"> & {
  "category":Pick<ExistingServiceCategory,"id"|"nameI18n">
  "images":Pick<z.infer<typeof selectServiceImageSchema>,"src"|"sortOrder">[]
}



export type ServiceFilters = {
  query?:string,
  categoryId?:string,
  type?:string,
}



export interface Service {
  id: string
  name: string
  description: string
  category: ServiceCategory
  type: ServiceType
  pricingModel: "fixed" | "quote"
  price?: number
  estimatedDuration: string
  image: string
  features: string[]
  requirements: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
  services: Service[]
}

export interface ServiceType {
  id: string
  name: string
  description: string
}

export interface ServiceRequest {
  id: string
  serviceId: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: Address
  preferredDate: string
  preferredTime: string
  description: string
  urgency: "low" | "medium" | "high"
  status: ServiceRequestStatus
  assignedTechnician?: string
  estimatedCost?: number
  actualCost?: number
  notes: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface QuoteRequest {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  company?: string
  serviceType: string
  description: string
  location: Address
  preferredContactMethod: "email" | "phone"
  urgency: "low" | "medium" | "high"
  status: QuoteStatus
  estimatedCost?: number
  validUntil?: string
  notes: string[]
  attachments: string[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Technician {
  id: string
  name: string
  email: string
  phone: string
  specialties: string[]
  rating: number
  isActive: boolean
  avatar?: string
}

export type ServiceRequestStatus = "pending" | "confirmed" | "assigned" | "in-progress" | "completed" | "cancelled"

export type QuoteStatus = "pending" | "in-review" | "quoted" | "accepted" | "rejected" | "expired"
