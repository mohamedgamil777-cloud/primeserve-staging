import React from 'react'
import { Separator } from '../ui/separator'
import { useCart } from '@/hooks/use-cart'
import { genProductImageUrl } from '@/lib/product'
import CheckoutOrderSummrySkeleton from './checkout-order-summry-skeleton'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useTranslations } from 'next-intl'
import { getLocalizedValue } from '@/types/internationalization'
import { useLocale } from '@/hooks/use-locale'

type Props = {}

export default function CheckoutOrderSummary({}: Props) {
  const t = useTranslations()
  const locale = useLocale()
  const { isLoading:isLoadingCurrentUser } = useCurrentUser()
  const { 
    data:items, isLoading, subtotal, baseShipping, tax, finalTotal,
    shippingDiscount, rewardDiscount, promoCodeDiscount, appliedPromoCode, appliedReward
  } = useCart()
  if(isLoading || isLoadingCurrentUser) return <CheckoutOrderSummrySkeleton/>
  return (
    <div>
      <div className="rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-medium">{t('order-summary')}</h3>
        </div>
        <Separator />
        <div className="p-6 space-y-4">
          <div className="max-h-[250px] overflow-auto space-y-3">
            {items?.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="flex gap-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                  <img
                    src={genProductImageUrl(item.product.mainImage)}
                    alt={getLocalizedValue(item.product.nameI18n,locale)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">{getLocalizedValue(item.product.nameI18n,locale)}</h4>
                    <p className="text-sm">
                      {item.product.discountPercentage > 0 ? (
                        <span>EGP {(item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2)}</span>
                      ) : (
                        <span>EGP {item.product.price.toFixed(2)}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p>Qty {item.quantity}</p>
                    {item.product.discountPercentage > 0 && (
                      <p className="text-green-600">{t('save')} {item.product.discountPercentage}%</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Separator />
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

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('tax')}</span>
              <span>EGP {tax.toFixed(2)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-medium">
            <span>{t('total')}</span>
            <span>EGP {finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>


  )
}