"use client"
import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import { useCart } from '@/hooks/use-cart'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { applyPromotionCode } from '@/actions/promotionCode'
import { toast } from 'sonner'
import { CartSettingsValidator } from './cart-settings-validator'
import { StoreCartSettings } from '@/db/schema/storeCartSettings'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

type Props = {
  storeCartSettings:StoreCartSettings|null
}

export default function CartOrderSummary({storeCartSettings}: Props) {
  const t = useTranslations()
  const router = useRouter()
  const [promoCode, setPromoCode] = useState("")

  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const { 
    shippingDiscount, subtotal, appliedReward, appliedPromoCode,
    baseShipping, rewardDiscount, promoCodeDiscount, setAppliedPromoCode,
    finalTotal, discount, data:items
  } = useCart()

  const handleApplyPromo = async() => {
    if(appliedPromoCode) return
    setIsApplyingPromo(true)
    try {
      const res = await applyPromotionCode(promoCode,subtotal)
      if(res.error) toast.error(res.error)
      else if(res.promotion){
        toast.success(t('promotion-code-has-been-applied-to-your-order'))
        setAppliedPromoCode(res.promotion)        
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later-0'))
    }
    setIsApplyingPromo(false)
  }


  return (
    <div className="rounded-lg border">
      <div className="p-6">
        <h3 className="text-lg font-medium">{t('order-summary')}</h3>
      </div>
      <Separator />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('subtotal')}</span>
            <span>EGP {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('shipping')}</span>
            <span>{baseShipping === 0 ? t('free') : `EGP ${baseShipping.toFixed(2)}`}</span>
          </div>
          {shippingDiscount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span>{t('shipping-discount')}</span>
              <span>-EGP {shippingDiscount.toFixed(2)}</span>
            </div>
          )}
          {appliedReward && (
            <div className="flex items-center justify-between text-green-600">
              <span>{t('reward-discount')}</span>
              <span>
                {
                  appliedReward.reward?.type === "shipping"
                  ?
                  `Free Shipping`
                  :
                  `-$${rewardDiscount.toFixed(2)}`
                }
              </span>
            </div>
          )}
          {appliedPromoCode && (
            <div className="flex items-center justify-between text-green-600">
              <span>{t('promo-discount')}</span>
              <span>
                {
                  appliedPromoCode.type === "shipping"
                  ?
                  t('free-shipping')
                  :
                  `-$${promoCodeDiscount.toFixed(2)}`
                }
              </span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex items-center justify-between font-medium">
          <span>{t('total')}</span>
          <span>EGP {finalTotal.toFixed(2)}</span>
        </div>
        {
          !!storeCartSettings?.promotionEnabled
          &&
          <div className="space-y-2">
            {
              !appliedPromoCode
              &&
              <div className="flex gap-2">
                <Input
                  placeholder={t('promo-code')}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" onClick={handleApplyPromo} disabled={isApplyingPromo || !promoCode}>
                  {isApplyingPromo ? "Applying..." : t('apply')}
                </Button>
              </div>
            }
            {discount > 0 && <p className="text-xs text-green-600">{t('discount-applied-successfully')}</p>}
          </div>
        }
        <CartSettingsValidator
          {...(storeCartSettings ?? {})}
          currentItemCount={items?.reduce((acc,cur)=>acc+cur["quantity"],0) ?? 0}
          currentTotal={subtotal}
          onProceed={()=>router.push("/checkout")}
        >
          <Button className="w-full" size="lg">
            {t('proceed-to-checkout')}
          </Button>
        </CartSettingsValidator>
        <p className="text-center text-xs text-muted-foreground">{t('taxes-calculated-at-checkout')}</p>
      </div>
    </div>
  )
}