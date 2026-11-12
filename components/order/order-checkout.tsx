"use client"
import React, { useEffect, useState } from 'react'
import EditAddressDialog from '../address/edit-address-dialog'
import { Button } from '../ui/button'
import { CreditCard, Plus } from 'lucide-react'
import { Separator } from '../ui/separator'
import AddressCard from '../address/address-card'
import { useAddresses } from '@/hooks/use-addresses'
import { cn, range } from '@/lib/utils'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import AddressCardSkeleton from '../address/address-card-skeleton'
import EmptyAddresses from '../address/empty-addresses'
import { toast } from 'sonner'
import { confirmOrder } from '@/actions/order'
import { useQueryClient } from '@tanstack/react-query'
import { useCart } from '@/hooks/use-cart'
import { useTranslations } from 'next-intl'

type Props = {
  setOrderId:(orderId:string)=>void
}

export default function OrderCheckout({setOrderId}: Props) {
  const t = useTranslations()
  const { appliedReward, appliedPromoCode, setAppliedPromoCode, removeReward } = useCart()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data:addresses, isLoading:isLoadingAddresses } = useAddresses()
  const [selectedAddress, setSelectedAddress] = useState(addresses?.find(address=>address.isDefault)?.id ?? addresses?.at(0)?.id)
  
  useEffect(()=>{
    if(!selectedAddress && !!addresses?.length) setSelectedAddress(
      addresses.find(address=>address.isDefault)?.id
      ??
      addresses.at(0)?.id
    )
  },[addresses,selectedAddress])
  
  async function onSubmit() {
    if(!selectedAddress) return toast.error(t('please-select-the-address-where-the-order-should-be-shipped-to'))
    setIsSubmitting(true)
    try {
      const res = await confirmOrder(selectedAddress,appliedReward?.id,appliedPromoCode?.id)
      if(res.error) toast.error(res.error)
      else if(res.success){
        setOrderId(res.orderId)
        removeReward()
        setAppliedPromoCode(null)
        await Promise.all([
          queryClient.invalidateQueries({"queryKey":["cart"]}),
          queryClient.invalidateQueries({"queryKey":["orders"]}),
          queryClient.invalidateQueries({"queryKey":["rewards"]}),
          queryClient.invalidateQueries({"queryKey":["redeemed-rewards"]}),
          queryClient.invalidateQueries({"queryKey":["products"]}),
          queryClient.invalidateQueries({"queryKey":["budgets"]}),
          queryClient.invalidateQueries({"queryKey":["customer-analytics"]}),
        ])
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsSubmitting(false)
  }
  
  return (
    <div className="md:col-span-2 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{t('checkout')}</h1>
        <p className="text-muted-foreground">{t('review-your-order-and-complete-your-purchase')}</p>
      </div>
      <div className="space-y-8">
        {/* Shipping Address */}
        <div className="rounded-lg border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('shipping-address')}</h3>
                <EditAddressDialog>
                  <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('add-new')}
                  </Button>
                </EditAddressDialog>
            </div>
          </div>
          <Separator />
          <div className="p-6 grid md:grid-cols-3 gap-3">
            {
              isLoadingAddresses
              ?
              range(0,6).map(idx=>(
                <AddressCardSkeleton key={idx}/>                
              ))
              :
              !addresses?.length
              ?
              <EmptyAddresses 
                className=' md:col-span-3'
                description={t('add-a-shipping-address-to-proceed-with-checkout')}
              />
              :
              addresses?.map((address) => (
                <div 
                  key={address.id}
                  className={cn("cursor-pointer rounded-xl",selectedAddress === address.id && "border-primary border-2")}
                  onClick={()=>setSelectedAddress(address.id)}
                >
                  <AddressCard address={address} key={address.id}/>                
                </div>
              ))
            }
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-lg border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('payment-method')}</h3>
              <Button disabled variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('add-new')}
              </Button>
            </div>
          </div>
          <Separator />
          <div className="p-6">
            <Card className="hover:bg-muted/50 transition-colors border-primary rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{t('pay-on-delviery')}</p>
                        <Badge variant="secondary">{t('default')}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('order-now-and-pay-when-the-order-is-delivered')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {/* <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className=' w-full cursor-pointer' onClick={onSubmit} size="lg" disabled={isSubmitting || !selectedAddress}>
            {isSubmitting ? "Processing..." : t('place-order')}
          </Button>
        </div>
      </div>
    </div>
  )
}