"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type Props = {}

export default function EmptyCart({}: Props) {
  const t = useTranslations()
  const locale = useLocale()
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-12 text-center">
      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t('your-cart-is-empty')}</h3>
        <p className="text-sm text-muted-foreground">{t('looks-like-you-havent-added-anything-to-your-cart-yet')}</p>
      </div>
      <Button asChild>
        <Link href={`/${locale}/products`}>{t('continue-shopping')}</Link>
      </Button>
    </div>
  )
}