"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { WishlistSort, wishlistSorts, WishlistStockFilter, wishlistStockStatuses } from "@/types/wishlist"
import { useWishlist } from "@/hooks/use-wishlist"
import EmptyWishlist from "@/components/wishlist/empty-wishlist"
import { range } from "@/lib/utils"
import { WishlistItemSkeleton } from "@/components/wishlist/wishlist-item-skeleton"
import WishlistItemCard from "@/components/wishlist/wishlist-item-card"
import { toast } from "sonner"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useTranslations } from "next-intl"

export default function WishlistPage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebouncedValue(searchQuery,1000)
  const [sortBy, setSortBy] = useState<WishlistSort>("date-desc")
  const [stockFilter, setStockFilter] = useState<WishlistStockFilter>("all")



  const { data, isLoading, clearWishlist } = useWishlist({
    "query":debouncedSearchQuery,
    "sort":sortBy,
    "stockFilter":stockFilter
  })
  const { addItems } = useCart()
  const wishlistItems = data ?? []
  const handleAddAllItemsToCart = async ()=>{
    addItems((data ?? []).map(item=>({
      "product":{
        ...item,
        "discountPercentage":0,
        "stock":1,
        "category":{
          "nameI18n":item.category
        }
      },
      "quantity":1
    })))
    await clearWishlist()
    toast.success(t('all-items-of-your-wishlist-have-been-added-to-your-cart'))
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('my-wishlist')}</h1>
        <p className="text-muted-foreground">{t('items-youve-saved-for-later')}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            type="search" 
            placeholder={t('search-wishlist')} 
            className="w-full pl-8" 
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={stockFilter} onValueChange={(val)=>setStockFilter(val as WishlistStockFilter)} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('filter-by')} />
            </SelectTrigger>
            <SelectContent>
              {
                Object.entries(wishlistStockStatuses).map(item=>(
                  <SelectItem key={item[0]} value={item[0]}>{item[1]}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(val)=>setSortBy(val as WishlistSort)} defaultValue="date-desc">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('sort-by')} />
            </SelectTrigger>
            <SelectContent>
              {
                Object.entries(wishlistSorts).map(item=>(
                  <SelectItem key={item[0]} value={item[0]}>{item[1]}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('wishlist-items')} ({wishlistItems.length})</CardTitle>
          <CardDescription>{t('items-youve-saved-for-future-purchase')}</CardDescription>
        </CardHeader>
        <CardContent>
          {
          isLoading
          ?
            <div className="space-y-6">
              {
                range(0,6).map(idx=>(
                  <WishlistItemSkeleton key={idx}/>
                ))
              }
            </div>
          :
          wishlistItems.length === 0 ? (
            <EmptyWishlist/>
          ) : (
            <div className="space-y-6">
              {wishlistItems.map((item) => (
                <WishlistItemCard key={item.id} item={item}/>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {wishlistItems.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={clearWishlist} variant="outline" className="mr-2">
            {t('clear-wishlist')}
          </Button>
          <Button onClick={handleAddAllItemsToCart}>{t('add-all-to-cart')}</Button>
        </div>
      )}
    </div>
  )
}
