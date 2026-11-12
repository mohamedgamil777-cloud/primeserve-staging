import PromotionsPage from '@/components/admin/promotions/promotions-page'
import { db } from '@/db';
import { promotionCodes, promotionCodeUsages } from '@/db/schema';
import { count, countDistinct, eq } from 'drizzle-orm';
import React from 'react'

type Props = {}

export default async function page({}: Props) {
  const [
    [totalPromotions],
    [activePromotions],
    [totalRedemptions],
    [uniqueCustomers]
  ] = await Promise.all([
    db.select({ count: count() }).from(promotionCodes),
    db.select({ count: count() }).from(promotionCodes).where(eq(promotionCodes.isActive,true)),
    db.select({ count: count() }).from(promotionCodeUsages),
    db.select({ count: countDistinct(promotionCodeUsages.customerId) }).from(promotionCodeUsages),
  ])
  return (
    <PromotionsPage
      totalPromotions={totalPromotions.count}
      activePromotions={activePromotions.count}
      totalRedemptions={totalRedemptions.count}
      uniqueCustomers={uniqueCustomers.count}
    />
  )
}