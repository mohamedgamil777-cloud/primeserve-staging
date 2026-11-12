"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DetailedCartItem } from '@/types/cart'
import { useTranslations } from 'next-intl'

type Props = {
  orderItems:DetailedCartItem[]
}

export default function BuyAgainButton({orderItems}: Props) {
  const t = useTranslations()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { addItems } = useCart()
  const handleBuyAgain = ()=>{
    setIsLoading(true)
    addItems(orderItems as any)
    setIsLoading(false)
    toast.success(t('all-items-has-been-added-to-your-card-you-can-proceed-from-there'))
    router.push("/cart")
  }
  return (
    <Button disabled={isLoading} onClick={handleBuyAgain}>{t('buy-again')}</Button>
  )
}