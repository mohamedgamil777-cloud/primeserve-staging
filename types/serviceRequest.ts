import { z } from "zod";
import { selectServiceRequestSchema, serviceRequestStatuses, serviceRequestUrgencies } from "@/db/schema/serviceRequests";
import { ExistingUser } from "./user";
import { ExistingService } from "./services";
import { ExistingAddress } from "./address";

export type ExistingServiceRequest = Omit<z.infer<typeof selectServiceRequestSchema>,"updatedAt"|"storeId">
export type DetailedServiceRequest = Pick<ExistingServiceRequest,"timeline"|"desiredDaytime"|"status"|"urgency"|"description"|"createdAt"|"budget"|"contactMethod"|"id"> & {
    "customer":Pick<ExistingUser,"firstName"|"lastName"|"email">,
    "service":Pick<ExistingService,"id"|"nameI18n"|"price"|"pricingModel">,
    "address":Pick<ExistingAddress,"id"|"address"|"city"|"state"|"phone">,
}

export type ServiceRequestUrgency = typeof serviceRequestUrgencies[number]
export type ServiceRequestStatus = typeof serviceRequestStatuses[number]

export type ServiceRequestFilters = {
  query?:string,
  status?:ServiceRequestStatus,
  urgency?:ServiceRequestUrgency,
}
