import { useCart } from '@/hooks/use-cart'
import React from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {}

export default function AppliedCartReward({}: Props) {
  const t = useTranslations()
  const { appliedReward, removeReward } = useCart()
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-green-800">{appliedReward?.reward?.name}</h4>
          <p className="text-sm text-green-600">
            {appliedReward?.reward?.type === "discount"
              ? `$${appliedReward.reward?.name} ${t('discount-applied')}`
              : t('free-shipping-applied')}
          </p>
          {/* <p className="text-xs text-green-600 font-mono">{appliedReward.code}</p> */}
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            removeReward()
            toast.success("Reward removed")
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}