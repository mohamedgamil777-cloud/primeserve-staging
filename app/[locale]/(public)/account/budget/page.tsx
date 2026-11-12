import CustomerBudgetManagementPage from '@/components/budgets/customer-budget-management-page'
import RedirectToDashboard from '@/components/common/redirect-to-dashboard'
import { db } from '@/db'
import { getSession } from '@/lib/auth-server'
import { getTenantId } from '@/lib/tenant'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const [storeId,t] = await Promise.all([
    getTenantId(),
    getTranslations({"locale":(await params).locale}),
  ]) 
  const storeInfo = await db.query.stores.findFirst({
    "where":(stores,{eq})=>eq(stores.id,storeId),
    "columns":{
      "name":true,
    },
  })
  return {
    title: `${t("budget-management")} | ${storeInfo?.name}`,
    description: t('track-and-manage-your-spending-budgets-0'),
  };
}


export default async function page({}: Props) {
  const session = await getSession()
  if(!session) redirect("/auth/login")
  if(session.user_role !== "customer") return <RedirectToDashboard role={session.user_role}/>
  return (
    <CustomerBudgetManagementPage/>
  )
}