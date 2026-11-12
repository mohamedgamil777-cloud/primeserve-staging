"use client"
import { useTranslations } from "next-intl"
import { formatDate } from '@/lib/date'
import { genProductImageUrl } from '@/lib/product'
import { WishlistItem } from '@/types/wishlist'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { toast } from 'sonner'
import { getLocalizedValue } from '@/types/internationalization'
import { useLocale } from '@/hooks/use-locale'

type Props = {
  item:WishlistItem
}

export default function WishlistItemCard({item}: Props) {
  const tu = useTranslations("ui")
  const locale = useLocale()
  const { addItems:addItemsToCart } = useCart()
  const { removeItem:removeItemFromWishlist } = useWishlist({})
  const handleAddToCart = ()=>{
    addItemsToCart([{
      "quantity":1,
      "product":{
        ...item,
        "stock":1,
        "discountPercentage":0,
        "category":{
          "nameI18n":item.category
        }
      }
    }])
    removeItemFromWishlist(item.id)
    toast.success(`${getLocalizedValue(item.nameI18n,locale)} has been added to your cart`)
  }
  const handleRemoveFromWishList = ()=>{
    removeItemFromWishlist(item.id)
    toast.success(`${getLocalizedValue(item.nameI18n,locale)} has been removed from your wishlist`)
  }
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-lg border p-4">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={genProductImageUrl(item.mainImage)}
          alt={getLocalizedValue(item.nameI18n,locale)}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col text-center sm:text-left">
        <h4 className="font-medium">{getLocalizedValue(item.nameI18n,locale)}</h4>
        <p className="text-sm text-muted-foreground">Category: {getLocalizedValue(item.category,locale)}</p>
        <p className="text-sm text-muted-foreground">Added on: {formatDate(item.addedOn)}</p>
        <p className="font-medium mt-1">EGP {item.price.toFixed(2)}</p>
        {!item.inStock && <p className="text-sm text-destructive mt-1">{tu("outOfStock")}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/${locale}/products/${item.id}`}>{tu("viewProduct")}</Link>
        </Button>
        <Button 
          onClick={handleAddToCart} 
          size="sm" 
          className="flex-1" 
          disabled={!item.inStock}
        >
          Add to Cart
        </Button>
        <Button 
          variant="ghost" size="icon" className="flex-shrink-0"
          onClick={handleRemoveFromWishList}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">{tu("remove")}</span>
        </Button>
      </div>
    </div>
  )
}