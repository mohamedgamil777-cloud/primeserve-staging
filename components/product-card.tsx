"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Plus, Minus, Check, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { ProductItem } from "@/types/product"
import { genProductImageUrl } from "@/lib/product"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { BackInStockDialog } from "./product/back-in-stock-dialog"
import { useActiveReminders } from "@/hooks/use-active-reminders"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTranslations } from "next-intl"
import { useLocale } from "@/hooks/use-locale"
import { getLocalizedValue } from "@/types/internationalization"

interface ProductCardProps {
  product: ProductItem
  index?: number,
  detailed?:boolean
}

export function ProductCard({ product, index = 0, detailed }: ProductCardProps) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { data:cart, addItems, removeItem, updateItemQuantity } = useCart()
  const { data:wishListItems, addItem:addItemToWishList, removeItem:removeItemFromWishList } = useWishlist({})
  const { data:activeReminders } = useActiveReminders()
  // Find if product is already in cart and get its quantity
  const cartItem = cart?.find((item) => item.product.id === product.id)
  const isInCart = !!cartItem
  const isOutOfStock = product.stock === 0

  const localizedProductName = getLocalizedValue(product.nameI18n,locale) ?? "" 


  const isInWishList = wishListItems?.find(i=>i.id === product.id)
  const toggleWishState = ()=>{
    if(isInWishList){
      removeItemFromWishList(product.id)
      toast.success(`${localizedProductName} ${t('has-been-removed-from-your-wishlist')}`)
    } 
    else{
      addItemToWishList({
        ...product,
        "addedOn":new Date(),
        "category":product.category.nameI18n,
        "inStock":product.stock! > 0
      })
      toast.success(`${localizedProductName} ${t('has-been-added-to-your-wishlist')}`)
    } 
  }

  // Sync quantity with cart on mount and when cart changes
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity)
    } else {
      setQuantity(1)
    }
  }, [cartItem])

  const handleAddToCart = () => {
    if (isInCart) {
      // If already in cart, update quantity
      updateItemQuantity({"productId":product.id,"newQuantity":quantity})
      toast.success(`Your cart's quantity of "${localizedProductName}" has been updated to ${quantity}`)
    } else {
      // Add the product to cart with the selected quantity
      addItems([{"product":product,quantity}])
      toast.success(`${localizedProductName} ${t('has-been-added-to-your-cart')}`)
    }
  }

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeItem(product.id)
    toast.success(`${localizedProductName} ${t('has-been-removed-your-cart')}`)
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newQuantity = quantity + 1
    setQuantity(newQuantity)

    // If already in cart, update quantity immediately
    if (isInCart) {
      updateItemQuantity({"productId":product.id,newQuantity})
      toast.success(`Your cart's quantity of "${localizedProductName}" has been updated to ${newQuantity}`)
    }
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)

      // If already in cart, update quantity immediately
      if (isInCart) {
        updateItemQuantity({"productId":product.id,newQuantity})
        toast.success(`Your cart's quantity of "${localizedProductName}" has been updated to ${newQuantity}`)
      }
    }
  }

  const goToProductPage = ()=>{
    if(detailed) router.push(`/products/${product.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={cn("overflow-hidden group py-0",isOutOfStock ? "opacity-75" : "",detailed && "cursor-pointer")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <div className=" inline" onClick={goToProductPage}>
            <div className="relative h-full w-full">
              <img
                src={genProductImageUrl(product.mainImage)}
                alt={localizedProductName}
                className={cn("object-cover w-full h-full transition-transform duration-300 group-hover:scale-105",isOutOfStock ? "grayscale" : "")}
              />
              {/* {product.images.length > 1 && (
                <img
                  src={product.images[1] || "/placeholder.png"}
                  alt={product.name}
                  className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0",isOutOfStock ? "grayscale" : ""
                  }`}
                />
              )} */}
            </div>
          </div>
          {product.isNew && <Badge className="absolute top-2 left-2 z-10">{t('new')}</Badge>}
          {(product.discountPercentage ?? 0) > 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2 z-10">
              -{product.discountPercentage}%
            </Badge>
          )}
          {isInCart && !isOutOfStock && (
            <Badge variant="secondary" className="absolute top-2 right-2 z-10 mr-16">
              <ShoppingCart className="h-3 w-3 mr-1" /> {t('in-cart')}
            </Badge>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20 flex-col gap-3">
              <Badge variant="secondary" className="text-lg font-semibold">
                {t('out-of-stock-0')}
              </Badge>
              {
                activeReminders?.includes(product.id)
                ?
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary/90 backdrop-blur-sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t('notify-me')}
                </Button>
                :
                <BackInStockDialog product={product}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background/90 backdrop-blur-sm cursor-pointer"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {t('notify-me')}
                  </Button>
                </BackInStockDialog>
              }
            </div>
          )}
          {!isOutOfStock && (

            <div className={cn("absolute bottom-0 left-0 right-0 p-2 flex flex-col gap-2 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",isMobile && "opacity-100")}>
              <div className="flex justify-between items-center">
                <Button variant="secondary" size="icon" className={cn("rounded-full",isInWishList && "bg-primary hover:bg-primary")} onClick={toggleWishState}>
                  <Heart className={"h-4 w-4"} />
                  <span className="sr-only">{t('add-to-wishlist')}</span>
                </Button>

                <div className="flex items-center bg-background rounded-full overflow-hidden border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={decrementQuantity}
                    disabled={isOutOfStock || quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <Button 
                    disabled={isOutOfStock || quantity >= (product.stock ?? 0)}
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none" 
                    onClick={
                      quantity === 0
                      ?
                      handleAddToCart
                      :
                      quantity < (product.stock ?? 0)
                      ?
                      incrementQuantity
                      :
                      undefined
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {isInCart ? (
                <Button variant="secondary" size="sm" className="w-full" onClick={handleRemoveFromCart}>
                  <Check className="h-4 w-4 mr-2" />
                  {t('remove-from-cart')}
                </Button>
              ) : (
                <Button size="sm" className="w-full" disabled={isOutOfStock} onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                   {isOutOfStock ? t('out-of-stock-0') : t('add-to-cart')}
                </Button>
              )}
            </div>
          )}
        </div>
        <CardContent className="px-4">
          <div onClick={goToProductPage} className="block">
            <h3 className="font-bold line-clamp-1 hover:underline md:text-lg">{localizedProductName}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{getLocalizedValue(product.category.nameI18n,locale)}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(product.discountPercentage ?? 0) > 0 ? (
              <>
                <span className="font-medium">EGP {product.price * (1 - (product.discountPercentage ?? 0) / 100)}</span>
                <span className="text-sm text-muted-foreground line-through">EGP {product.price}</span>
              </>
            ) : (
              <span className="font-medium">EGP {product.price}</span>
            )}
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < (product.rating ?? 0) ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
