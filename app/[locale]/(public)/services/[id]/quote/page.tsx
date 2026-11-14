import QuoteRequestPage from '@/components/admin/services/quote-request-page'
import { db } from '@/db'
import { getSession } from '@/lib/auth-server'
import { getTenantId } from '@/lib/tenant'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

export default async function page({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const [{ id:serviceId, locale },storeId,session] = await Promise.all([
    params,
    getTenantId(),
    getSession()
  ])
  if(!session) redirect(`/${locale}/contact`)
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
      "longDescriptionI18n":true
    }
  })

  if(!service) redirect("/services")
  if(service.pricingModel !== "quote") redirect(`/services/${serviceId}/request`)

  return (
    <QuoteRequestPage service={service}/>
  )
}