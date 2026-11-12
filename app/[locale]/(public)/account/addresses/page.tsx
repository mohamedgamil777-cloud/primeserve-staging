import CustomerAddressesPage from '@/components/address/customer-addresses-page';
import RedirectToDashboard from '@/components/common/redirect-to-dashboard';
import { db } from '@/db';
import { getSession } from '@/lib/auth-server';
import { getTenantId } from '@/lib/tenant';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const [storeId,t] = await Promise.all([
    getTenantId(),
    getTranslations({"locale":(await params).locale})
  ]) 
  const storeInfo = await db.query.stores.findFirst({
    "where":(stores,{eq})=>eq(stores.id,storeId),
    "columns":{
      "name":true,
    },
  })
  return {
    title: `${t('my-addresses')} | ${storeInfo?.name}`,
    description: t('manage-your-addresses-list-which-can-be-used-for-delivering-orders-or-as-destinations-for-our-service-providers'),
  };
}


export default async function page({}: Props) {
  const session = await getSession()
  if(!session) redirect("/auth/login")
  if(session.user_role !== "customer") return <RedirectToDashboard role={session.user_role}/>
  
  return (
    <CustomerAddressesPage/>
  )
}