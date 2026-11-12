import ProductsPage from '@/components/product/products-page'
import { db } from '@/db'
import { getTenantId } from '@/lib/tenant'
import React from 'react'

type Props = {}

export const dynamic = 'force-dynamic';
export default async function page({}: Props) {
  const storeId = await getTenantId()
  const _storeDisplaySettings = await db.query.storeDisplaySettings.findFirst({
    "where":(storeDisplaySettings,{eq})=>eq(storeDisplaySettings.storeId,storeId)
  })
  return (
    <ProductsPage detailed={_storeDisplaySettings?.productStyle === "detailed"}/>
  )
}