import React from 'react'
import ServiceCard from './service-card'
import { getServiceItems } from '@/db/lib/service'
import { getTenantId } from '@/lib/tenant'
import { db } from '@/db'

type Props = {}

export const dynamic = 'force-dynamic';
export default async function FeaturedServices({}: Props) {
  const storeId = await getTenantId()
  const [featuredServices,_storeDisplaySettings] = await Promise.all([
    getServiceItems({
      "storeId":storeId,
      "page":1,
      "filter":{},
      "isActive":true,
      "isFeatured":true,
    }),
    db.query.storeDisplaySettings.findFirst({
      "where":(storeDisplaySettings,{eq})=>eq(storeDisplaySettings.storeId,storeId)
    })
  ]) 
  if(featuredServices.length === 0) return null
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Popular Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredServices.map((service) => (
          <ServiceCard key={service.id} detailed={_storeDisplaySettings?.serviceStyle === "detailed"} service={service}/>
        ))}
      </div>
    </section>
  )
}