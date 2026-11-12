import { storeCartSettingsDefaultValues } from '@/components/admin/settings/store-cart-settings-form'
import CartPage from '@/components/cart/cart-page'
import { db } from '@/db'
import { getTenantId } from '@/lib/tenant'
import React from 'react'

type Props = {}

export default async function page({}: Props) {
  const storeId = await getTenantId() 
  const [storeCartSettings,storeDisplaySettings] = await Promise.all([
    db.query.storeCartSettings.findFirst({
      "where":(storeCartSettings,{eq})=>eq(storeCartSettings.storeId,storeId)
    }),
    db.query.storeDisplaySettings.findFirst({
      "columns":{"cartStyle":true},
      "where":(storeDisplaySettings,{eq})=>eq(storeDisplaySettings.storeId,storeId)
    }),
  ]) 
  return (
    <CartPage
      storeCartSettings={storeCartSettings ?? storeCartSettingsDefaultValues}
      cartStyle={storeDisplaySettings?.cartStyle}
    />
  )
}