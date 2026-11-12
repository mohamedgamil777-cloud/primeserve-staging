import CreateServicePage from "@/components/admin/services/create-service-page"
import { db } from "@/db"
import { getTenantId } from "@/lib/tenant"
import { ExistingService } from "@/types/services"



export default async function page({params}:{"params":Promise<{"id":string}>}) {
  const [{ id:serviceId }, storeId] = await Promise.all([params,getTenantId()])
  const service:ExistingService|undefined = serviceId === "new" ? undefined : await db.query.services.findFirst({
    "columns":{
      "id":true,
      "categoryId":true,
      "shortDescriptionI18n":true,
      "longDescriptionI18n":true,
      "estimatedDuration":true,
      "features":true,
      "highPriorityFee":true,
      "inclusions":true,
      "isActive":true,
      "mediumPriorityFee":true,
      "nameI18n":true,
      "price":true,
      "pricingModel":true,
      "requirements":true,
      "standardPriorityFee":true,
      "type":true,
      "slug":true,
      "isFeatured":true,
    },
    "where":(services,{eq,and})=>and(
      eq(services.id,serviceId),
      eq(services.storeId,storeId)
    ),
    "with":{
      "addOns":true,
      "images":true
    }
  })
  
  return (
    <CreateServicePage service={service}/>
  )
}
