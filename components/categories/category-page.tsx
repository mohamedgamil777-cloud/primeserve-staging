"use client"

import { PropsWithChildren } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Filter, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SubCategoryCard from "@/components/categories/sub-category-card"
import { cn } from "@/lib/utils"
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { DetailedCategory } from "@/types/category"
import { useProducts } from "@/hooks/use-products"
import { ProductPriceRange } from "@/lib/product"
import { ProductSort } from "@/types/product"
import InfiniteScrollContainer from "../common/infinite-scroll-container"
import { ProductCard } from "../product-card"
import { Skeleton } from "../ui/skeleton"
import { PublicFilteredProductsEmpty } from "../empty-states/public-empty-states"
import { useTranslations } from "next-intl"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"

export default function CategoryPage({category:currentCategory,children,detailedProducts}:PropsWithChildren<{category:DetailedCategory,detailedProducts?:boolean}>) {
  const locale = useLocale()
  // const router = useRouter()
  // const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useQueryState("query",parseAsString.withDefault(""))
  const [sortBy, setSortBy] = useQueryState("sort",parseAsString.withDefault("featured"))
  const [priceRange, setPriceRange] = useQueryState("priceRange",parseAsString.withDefault("all"))
  const [selectedSubcategories, setSelectedSubcategories] = useQueryState('sc', parseAsArrayOf(parseAsString))
  const debouncedQuery = useDebouncedValue(searchQuery,1000)

  // useEffect(()=>{setUrlSearchQuery(debouncedQuery)},[debouncedQuery])

  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategories((prev) =>
      prev?.includes(subcategoryId) ? prev.filter((id) => id !== subcategoryId) : [...(prev ?? []), subcategoryId],
    )
  }


  // useEffect(()=>{
  //   router.push(`/categories/${currentCategory.id}?${searchParams.toString()}`)
  // },[selectedSubcategories,priceRange,sortBy,urlSearchQuery])


  const query = useProducts({
    query:debouncedQuery,
    sort:!!sortBy ? sortBy as ProductSort : undefined,
    priceRange:!!priceRange ? priceRange as ProductPriceRange : undefined,
    categoryId:currentCategory.id,
    subcategoryIds:(selectedSubcategories ?? []).length > 0 ? (selectedSubcategories ?? []).join(",") : undefined,
  })

  const t = useTranslations()


  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/${locale}/categories`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getLocalizedValue(currentCategory.nameI18n,locale)}</h1>
            <p className="text-muted-foreground">{getLocalizedValue(currentCategory.descriptionI18n,locale)}</p>
          </div>
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
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('subcategories')}</h3>
                    <div className="space-y-2">
                      {currentCategory.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`mobile-subcategory-${subcategory.id}`}
                            checked={selectedSubcategories?.includes(subcategory.id)}
                            onChange={() => toggleSubcategory(subcategory.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label htmlFor={`mobile-subcategory-${subcategory.id}`}>{getLocalizedValue(subcategory.nameI18n,locale)}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('price-range')}</h3>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select-price-range')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('all-prices')}</SelectItem>
                        <SelectItem value="under-50">{t('under-50')}</SelectItem>
                        <SelectItem value="50-100">{t('50-100')}</SelectItem>
                        <SelectItem value="over-100">{t('over-100')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex md:items-center md:gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">{t('sort-by-0')}</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('sort-by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">{t('featured')}</SelectItem>
                  <SelectItem value="price-low-high">{t('price-low-to-high')}</SelectItem>
                  <SelectItem value="price-high-low">{t('price-high-to-low')}</SelectItem>
                  <SelectItem value="newest">{t('newest')}</SelectItem>
                  <SelectItem value="rating">{t('rating')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="hidden md:col-span-3 md:block">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('subcategories')}</h3>
                <div className="space-y-2">
                  {currentCategory.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`subcategory-${subcategory.id}`}
                        checked={selectedSubcategories?.includes(subcategory.id)}
                        onChange={() => toggleSubcategory(subcategory.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor={`subcategory-${subcategory.id}`}>
                        {getLocalizedValue(subcategory.nameI18n,locale)} ({subcategory.productCount})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('price-range')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="price-all"
                      name="price-range"
                      checked={priceRange === "all"}
                      onChange={() => setPriceRange("all")}
                      className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="price-all">{t('all-prices')}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="price-under-50"
                      name="price-range"
                      checked={priceRange === "under-50"}
                      onChange={() => setPriceRange("under-50")}
                      className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="price-under-50">{t('under-50')}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="price-50-100"
                      name="price-range"
                      checked={priceRange === "50-100"}
                      onChange={() => setPriceRange("50-100")}
                      className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="price-50-100">{t('50-100')}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="price-over-100"
                      name="price-range"
                      checked={priceRange === "over-100"}
                      onChange={() => setPriceRange("over-100")}
                      className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="price-over-100">{t('over-100')}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-9">
            {/* <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {currentCategory.subcategories.map((subcategory, index) => (
                <motion.div
                  key={subcategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div 
                    onClick={()=>{
                      toggleSubcategory(subcategory.id)
                    }}
                    >
                    <SubCategoryCard
                      className={cn("cursor-pointer",selectedSubcategories?.includes(subcategory.id) ? "border-primary border-2 rounded-lg" : "")}
                      subcategory={subcategory}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <Separator className="my-6" /> */}

            <h2 className="text-2xl font-bold mb-6">{t('popular-products')}</h2>
              <InfiniteScrollContainer
                query={query}
                keyExtractor={(product)=>product.id}
                renderItem={(product)=>(
                  <ProductCard detailed={detailedProducts} key={product.id} product={product}/>
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
                containerClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                customEmptyStateComponent={
                  <PublicFilteredProductsEmpty />
                }
              />

          </div>
        </div>
      </div>
    </div>
  )
}
