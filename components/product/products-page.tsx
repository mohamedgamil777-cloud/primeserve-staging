"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useProducts } from "@/hooks/use-products"
import InfiniteScrollContainer from "@/components/common/infinite-scroll-container"
import ProductSortSelector from "@/components/product/product-sort"
import { ProductSort } from "@/types/product"
import ProductPriceRangeSelector from "@/components/product/product-price-range-selector"
import { ProductPriceRange } from "@/lib/product"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import ProductCategoriesSelector from "@/components/product/product-categories-selector"
import { PublicFilteredProductsEmpty, PublicProductsEmpty } from "@/components/empty-states/public-empty-states"
import { useTranslations } from "next-intl"

export default function ProductsPage({detailed}:{detailed?:boolean}) {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebouncedValue(searchQuery,1000)
  const [sortBy, setSortBy] = useState<ProductSort>("featured")
  const [priceRange, setPriceRange] = useState<ProductPriceRange>("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])


  const hasActiveFilters = selectedCategories.length > 0 || priceRange !== "all" || searchQuery.length > 0

  const query = useProducts({
    query:debouncedSearchQuery,
    sort:sortBy,
    priceRange:priceRange,
    categoryIds:selectedCategories.length > 0 ? selectedCategories.join(",") : undefined
  })

  return (
    <div className="container px-4 py-8 md:px-6 mx-auto md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{t('all-products')}</h1>
          <p className="text-muted-foreground">{t('browse-our-collection-of-high-quality-products')}</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search-products')}
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  {t('filters')}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="space-y-6 p-4 overflow-y-scroll">
                  <ProductCategoriesSelector
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                  />
                  <ProductPriceRangeSelector
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <ProductSortSelector
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="hidden md:col-span-3 space-y-3 md:block">
            <ProductCategoriesSelector
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />

            <ProductPriceRangeSelector
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          <div className="md:col-span-9">
            <InfiniteScrollContainer
              query={query}
              keyExtractor={(product)=>product.id}
              renderItem={(product)=>(
                <ProductCard detailed={detailed} key={product.id} product={product}/>
              )}
              customSkeletonComponent={
                <div className="space-y-3 bg-background">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              }
              skeletonClassName=" h-auto"
              containerClassName="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3"
              customEmptyStateComponent={
                hasActiveFilters ? (
                  <PublicFilteredProductsEmpty />
                ) : (
                  <PublicProductsEmpty />
                )
              }
            />
            {/* {!isLoading && filteredAndSortedProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" size="lg">
                  Load More
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
