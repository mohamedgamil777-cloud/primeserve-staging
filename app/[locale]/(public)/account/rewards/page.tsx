import RedirectToDashboard from '@/components/common/redirect-to-dashboard'
import CustomerRewardsPage from '@/components/rewards/customer-rewards-page'
import { db } from '@/db'
import { getSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

export default async function page({}: Props) {
  const session = await getSession()
  if(!session) redirect("/auth/login")
  if(session.user_role !== "customer") return <RedirectToDashboard role={session.user_role}/>
  const customerLoyaltyPoints = await db.query.customerPoints.findFirst({
    "columns":{
      "points":true,
    },
    "with":{
      "tier":{
        "columns":{
          "id":true,
          "name":true,
          "color":true
        }
      }
    },
    "where":(customerPoints,{eq})=>eq(customerPoints.customerId,session?.user_id!)
  }) 
  return (
    <CustomerRewardsPage
      customerPoints={customerLoyaltyPoints}
    />
  )
}