"use client"
import { RedeemedRewardItem } from '@/types/reward'
import React from 'react'
import { Button } from '../ui/button'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'

type Props = {
  reward:RedeemedRewardItem,
}

export default function CartReward({reward}: Props) {
  const { applyReward, subtotal } = useCart()
  const handleApplyReward = () => {
    if (subtotal < (reward.reward?.minPurchase ?? 0)) {
      toast.error(`Minimum purchase of EGP ${reward.reward?.minPurchase} required for this reward`)
      return
    }
    applyReward(reward)
    toast.success(`${reward.reward?.name} applied successfully!`)
  }
  const canApply = subtotal >= (reward.reward?.minPurchase ?? 0)
  const daysUntilExpiry = !reward.expiresAt ? 100 : Math.ceil(
    (new Date(reward.expiresAt!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div
      key={reward.id}
      className={`border rounded-lg p-4 ${canApply ? "border-primary/20 bg-primary/5" : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium">{reward.reward?.name}</h4>
          <p className="text-sm text-muted-foreground">{reward.reward?.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {/* <span>Code: {reward.code}</span> */}
            <span>Expires in {daysUntilExpiry} days</span>
          </div>
          {!canApply && (
            <p className="text-xs text-orange-600 mt-1">
              Add EGP {((reward.reward?.minPurchase ?? 0) - subtotal).toFixed(2)} more to use this reward
            </p>
          )}
        </div>
        <Button size="sm" disabled={!canApply} onClick={() => handleApplyReward()}>
          Apply
        </Button>
      </div>
    </div>
  )

}