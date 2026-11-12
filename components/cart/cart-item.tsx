"use client"
import { DetailedCartItem } from '@/types/cart'
import React from 'react'
import { motion } from "framer-motion"
import { genProductImageUrl } from '@/lib/product'
import { Button } from '../ui/button'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getLocalizedValue } from '@/types/internationalization'
import { useLocale } from '@/hooks/use-locale'

type Props = {
  item:DetailedCartItem
}



export default function CartItem({item}: Props) {
  const t = useTranslations()
  const locale = useLocale()
  const { updateItemQuantity, removeItem } = useCart()
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col p-6 sm:flex-row"
    >
      <div className="flex flex-1 gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={genProductImageUrl(item.product.mainImage)}
            alt={getLocalizedValue(item.product.nameI18n,locale)}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">{getLocalizedValue(item.product.nameI18n,locale)}</h4>
            <p className="text-sm text-muted-foreground">{getLocalizedValue(item.product.category.nameI18n,locale)}</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateItemQuantity({"productId":item.product.id,"newQuantity":item.quantity - 1})}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={item.quantity >= (item.product.stock ?? 0)}
              onClick={item.quantity >= (item.product.stock ?? 0) ? undefined : () => updateItemQuantity({"productId":item.product.id,"newQuantity":item.quantity + 1})}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 sm:mt-0 sm:flex-col sm:items-end">
        <div className="flex items-center gap-1">
          {(item.product.discountPercentage ?? 0) > 0 ? (
            <>
              <span className="font-medium">
                EGP {(item.product.price * (1 - (item.product.discountPercentage ?? 0) / 100) * item.quantity).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                EGP {(item.product.price * item.quantity).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-medium">EGP {(item.product.price * item.quantity).toFixed(2)}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => removeItem(item.product.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">{t('remove')}</span>
        </Button>
      </div>
    </motion.li>

  )
}