import ServiceRequestsPage from '@/components/admin/service-requests/service-requests-page'
import { db } from '@/db'
import { serviceRequests } from '@/db/schema'
import { getTenantId } from '@/lib/tenant'
import { and, eq } from 'drizzle-orm'
import React from 'react'

type Props = {}

export default async function page({}: Props) {
  const storeId = await getTenantId()
  const [inProgress,completed,confirmed,pending] = await Promise.all([
    db.select({"id":serviceRequests.id}).from(serviceRequests).where(
      and(
        eq(serviceRequests.storeId,storeId),
        eq(serviceRequests.status,"in progress"),
      )
    ),
    db.select({"id":serviceRequests.id}).from(serviceRequests).where(
      and(
        eq(serviceRequests.storeId,storeId),
        eq(serviceRequests.status,"completed"),
      )
    ),
    db.select({"id":serviceRequests.id}).from(serviceRequests).where(
      and(
        eq(serviceRequests.storeId,storeId),
        eq(serviceRequests.status,"confirmed"),
      )
    ),
    db.select({"id":serviceRequests.id}).from(serviceRequests).where(
      and(
        eq(serviceRequests.storeId,storeId),
        eq(serviceRequests.status,"pending"),
      )
    ),
  ])
  return (
    <ServiceRequestsPage
      pendingCount={pending.length}
      completedCount={completed.length}   
      inProgressCount={inProgress.length}
      confirmedCount={confirmed.length}
    />
  )
}