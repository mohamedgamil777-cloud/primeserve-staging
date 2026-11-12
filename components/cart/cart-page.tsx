"use client"

import { Gift, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import EmptyCart from "@/components/cart/empty-cart"
import { range } from "@/lib/utils"
import { CartItemSkeleton } from "@/components/cart/cart-item-skeleton"
import { ExcelOrderButton } from "@/components/order/excel-order-dialog"
import CartItem from "./cart-item"
import CartOrderSummary from "./cart-order-summary"
import { StoreCartSettings } from "@/db/schema/storeCartSettings"
import CartAvailableRewards from "./cart-available-rewards"
import CartItemsTable from "./cart-items-table"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTranslations } from "next-intl"

type Props = {
  storeCartSettings:StoreCartSettings|null,
  cartStyle?:"card"|"grid"|null
}

export default function CartPage({storeCartSettings,cartStyle}:Props) {
  const t = useTranslations()
  const { 
    data:items, clearCart, isLoading,
  } = useCart()
  const isMobile = useIsMobile()

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">{t('shopping-cart')}</h1>
            <p className="text-muted-foreground">{t('review-and-modify-your-items-before-checkout')}</p>
          </div>
          <ExcelOrderButton/>
        </div>

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
        items?.length === 0 ? (
          <EmptyCart/>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{t('items')} ({items?.length ?? 0})</h3>
                    <Button variant="ghost" size="sm" onClick={clearCart}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('clear-cart')}
                    </Button>
                  </div>
                </div>
                <Separator />
                {
                  (cartStyle === "grid" && !isMobile)
                  ?
                  <CartItemsTable/>
                  :
                  <ul>
                    {         
                    items?.map((item, index) => (
                      <CartItem item={item} key={`${item.product.id}-${index}`}/>
                    ))}
                  </ul>
                }
              </div>
            </div>
            {/* Available Rewards Section */}
            <CartAvailableRewards rewardEnabled={!!storeCartSettings?.rewardEnabled}/>
            <div className=" row-span-2 md:order-2">
              <CartOrderSummary storeCartSettings={storeCartSettings}/>
              <div className="mt-6 rounded-lg border p-6">
                <h4 className="font-medium">{t('we-accept')}</h4>
                <div className="mt-4 flex gap-2">
                  <div className="rounded-md border bg-muted p-2">
                    <img src="/placeholder.png?height=30&width=40" alt={t('visa')} className="h-6" />
                  </div>
                  <div className="rounded-md border bg-muted p-2">
                    <img src="/placeholder.png?height=30&width=40" alt={t('mastercard')} className="h-6" />
                  </div>
                  <div className="rounded-md border bg-muted p-2">
                    <img src="/placeholder.png?height=30&width=40" alt={t("paypal")} className="h-6" />
                  </div>
                  <div className="rounded-md border bg-muted p-2">
                    <img src="/placeholder.png?height=30&width=40" alt={t('apple-pay')} className="h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
