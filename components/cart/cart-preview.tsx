"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCart } from "@/hooks/use-cart"
import { genProductImageUrl } from "@/lib/product"
import EmptyCart from "./empty-cart"
import { range } from "@/lib/utils"
import { CartItemSkeleton } from "./cart-item-skeleton"
import { useTranslations } from "next-intl"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"

export function CartPreview() {
  const locale = useLocale()
  const t = useTranslations()
  const { data:items, isLoading } = useCart()
  const subtotal = items?.reduce((acc,cur)=>acc + (cur["quantity"] * cur["product"].price * (100 - cur["product"]["discountPercentage"]) / 100 ),0) ?? 0 
  const hasItems = !!items?.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {hasItems && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {items.length}
            </span>
          )}
          <span className="sr-only">{t('cart')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <h3 className="font-medium">{t('your-cart')}</h3>
        </div>
        <Separator />

        {
          isLoading
          ?
          <div className="max-h-[300px] overflow-auto p-4 space-y-3">
            {
              range(0,5).map(idx=>(
                <CartItemSkeleton key={idx}/>
              ))
            }
          </div>
          :
          hasItems ? (
          <>
            <div className="max-h-[300px] overflow-auto p-4 space-y-3">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="flex gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={genProductImageUrl(item.product.mainImage ?? 0)}
                      alt={getLocalizedValue(item.product.nameI18n,locale)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium line-clamp-1">{getLocalizedValue(item.product.nameI18n,locale)}</h4>
                      <p className="text-sm font-medium">
                        {(item.product.discountPercentage ?? 0) > 0 ? (
                          <span>EGP {(item.product.price * (1 - (item.product.discountPercentage ?? 0) / 100)).toFixed(2)}</span>
                        ) : (
                          <span>EGP {item.product.price.toFixed(2)}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <p>Qty: {item.quantity}</p>
                      {(item.product.discountPercentage ?? 0) > 0 && <p className="text-green-600">-{item.product.discountPercentage}%</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between font-medium">
                <span>{t('subtotal')}</span>
                <span>EGP {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href={`/${locale}/cart`}>{t('view-cart')}</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${locale}/checkout`}>{t('checkout')}</Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyCart/>
        )}
      </PopoverContent>
    </Popover>
  )
}
