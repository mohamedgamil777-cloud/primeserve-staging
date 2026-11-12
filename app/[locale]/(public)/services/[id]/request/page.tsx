import BookServicePage from '@/components/admin/services/book-service-page'
import { db } from '@/db'
import { getSession } from '@/lib/auth-server'
import { getTenantId } from '@/lib/tenant'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const [{ id:serviceId },storeId,session] = await Promise.all([
    params,
    getTenantId(),
    getSession()
  ])
  if(!session) redirect("/auth/login")
  if(session.user_role !== "customer") redirect("/")

  const service = await db.query.services.findFirst({
    "where":(services,{eq,and})=>and(
      eq(services.id,serviceId),
      eq(services.storeId,storeId)
    ),
    "columns":{
      "id":true,
      "pricingModel":true,
      "nameI18n":true,
      "longDescriptionI18n":true,
      "price":true,
      "estimatedDuration":true,
      "standardPriorityFee":true,
      "mediumPriorityFee":true,
      "highPriorityFee":true
    },
    "with":{
      "addOns":true
    }
  })

  if(!service) redirect("/services")
  if(service.pricingModel !== "fixed") redirect(`/services/${serviceId}/quote`)

  return (
    <BookServicePage service={service}/>
  )
}