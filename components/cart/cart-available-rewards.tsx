"use client"
import { useCart } from '@/hooks/use-cart'
import { Gift } from 'lucide-react'
import React from 'react'
import AppliedCartReward from '../rewards/applied-cart-reward'
import InfiniteScrollContainer from '../common/infinite-scroll-container'
import CartReward from '../rewards/cart-reward'
import RedeemedRewardCardSkeleton from '../rewards/redeemed-reward-card-skeleton'
import { useRedeemedRewards } from '@/hooks/use-redeemed-rewards'
import RedeemedRewardsEmpty from '../rewards/redeemed-rewards-empty'
import { useTranslations } from 'next-intl'

type Props = {
  rewardEnabled?:boolean
}

export default function CartAvailableRewards({rewardEnabled}: Props) {
  const t = useTranslations()
  const redeemedRewardsQuery = useRedeemedRewards({
    "forCart":"true"
  })
  const { 
    data:items,
    appliedReward,
  } = useCart()
  if(!rewardEnabled) return null
  return (
    items?.length && items?.length > 0 && (
      <div className="md:col-span-2 md:order-3">
        <div className="rounded-lg border">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('available-rewards')}</h3>
            </div>

            {appliedReward ? (
              <AppliedCartReward/>
            ) : (
              <InfiniteScrollContainer
                query={redeemedRewardsQuery}
                keyExtractor={(reward)=>reward.id}
                renderItem={reward=><CartReward reward={reward}/>}
                customEmptyStateComponent={<RedeemedRewardsEmpty/>}
                customSkeletonComponent={<RedeemedRewardCardSkeleton/>}
                containerClassName="grid gap-4 md:grid-cols-1 lg:grid-cols-1 grid-cols-1"
                skeletonClassName=" bg-card h-auto"
              />                      
            )}
          </div>
        </div>
      </div>
    )
  )
}