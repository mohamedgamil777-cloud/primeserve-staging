"use client"

import { PropsWithChildren } from "react"
import { ArrowRight, Coffee, Filter, Gift, Layers, Search, ShieldCheck, SprayCan, type LucideIcon } from "lucide-react"
import { genCategoryImageUrl } from "@/lib/category"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  const ts = useTranslations("suppliesPage")

  // Design cards mapped to the existing subcategory IDs (no new categories are created).
  const cardConfig: Record<string, { key: string; icon: LucideIcon; image: string }> = {
    "79208799-e8ea-4dd6-8e22-52c97fe8f290": { key: "cleaning", icon: SprayCan, image: "/imgs/supplies/cleaning.webp" },
    "592cfc66-3e05-4925-bda4-209a7788a9d1": { key: "pantry", icon: Coffee, image: "/imgs/supplies/pantry.webp" },
    "9e403179-03a8-4dcc-b48f-ede2ef48ce48": { key: "office", icon: Layers, image: "/imgs/supplies/office.webp" },
    "845cdfcd-5009-4922-bbc6-d0f5f31b7a4a": { key: "safety", icon: ShieldCheck, image: "/imgs/supplies/safety.webp" },
    "09a5d356-99b1-4c06-a41e-15441b649f79": { key: "gifts", icon: Gift, image: "/imgs/supplies/gifts.webp" },
  }
  const order = Object.keys(cardConfig)
  const cards = [...currentCategory.subcategories].sort((x, y) => {
    const ix = order.indexOf(x.id), iy = order.indexOf(y.id)
    return (ix < 0 ? 99 : ix) - (iy < 0 ? 99 : iy)
  })

  const exploreSubcategory = (id: string) => {
    setSelectedSubcategories([id])
    document.getElementById("supplies-listing")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const priceOptions = [
    { value: "all", label: t('all-prices') },
    { value: "under-50", label: t('under-50') },
    { value: "50-100", label: t('50-100') },
    { value: "over-100", label: t('over-100') },
  ]

  const filters = (prefix: string) => (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-lg font-bold text-brand-navy">
        <Filter className="h-5 w-5 text-brand-teal" />{ts("filterTitle")}
      </div>
      <div className="space-y-3 border-t border-brand-border pt-4">
        <h3 className="font-semibold text-brand-navy">{ts("category")}</h3>
        <div className="space-y-2.5">
          {currentCategory.subcategories.map((subcategory) => (
            <label key={subcategory.id} htmlFor={`${prefix}-sc-${subcategory.id}`} className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-navy-2">
              <input
                type="checkbox"
                id={`${prefix}-sc-${subcategory.id}`}
                checked={!!selectedSubcategories?.includes(subcategory.id)}
                onChange={() => toggleSubcategory(subcategory.id)}
                className="h-4 w-4 rounded border-gray-300 accent-[var(--ps-teal)]"
              />
              <span className="flex-1">{getLocalizedValue(subcategory.nameI18n,locale)}</span>
              <span className="text-xs text-brand-navy-2/60">{subcategory.productCount}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-3 border-t border-brand-border pt-4">
        <h3 className="font-semibold text-brand-navy">{t('price-range')}</h3>
        <div className="space-y-2.5">
          {priceOptions.map((o) => (
            <label key={o.value} htmlFor={`${prefix}-price-${o.value}`} className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-navy-2">
              <input
                type="radio"
                id={`${prefix}-price-${o.value}`}
                name={`${prefix}-price-range`}
                checked={priceRange === o.value}
                onChange={() => setPriceRange(o.value)}
                className="h-4 w-4 border-gray-300 accent-[var(--ps-teal)]"
              />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const sortSelect = (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-full sm:w-[180px]">
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
  )

  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <span aria-hidden className="pointer-events-none absolute -start-32 -top-24 h-80 w-80 rounded-full bg-brand-green-soft" />
        <div className="absolute inset-y-0 end-0 hidden w-[62%] lg:block">
          <img src="/imgs/supplies/hero.webp" alt="" className="h-full w-full object-cover [mask-image:linear-gradient(to_right,transparent,black_30%)] rtl:[mask-image:linear-gradient(to_left,transparent,black_30%)]" />
        </div>
        <div className="container relative mx-auto px-4 py-10 md:px-6 lg:pb-28 lg:pt-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-orange sm:text-sm">
              <span className="h-0.5 w-10 bg-brand-orange" />{ts("eyebrow")}
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-navy md:text-5xl xl:text-6xl">
              {ts("title")}<span className="text-brand-orange">.</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-navy-2">{ts("text")}</p>
          </div>
          <img src="/imgs/supplies/hero.webp" alt="" className="mt-6 aspect-[16/7] w-full rounded-2xl object-cover lg:hidden" />
        </div>
      </section>

      {/* Category cards */}
      <section className="container relative mx-auto px-4 md:px-6 lg:-mt-14">
        <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 xl:grid-cols-5">
          {cards.map((sc) => {
            const cfg = cardConfig[sc.id]
            const Icon = cfg?.icon ?? Layers
            const active = !!selectedSubcategories?.includes(sc.id) && selectedSubcategories?.length === 1
            return (
              <button
                type="button"
                key={sc.id}
                onClick={() => exploreSubcategory(sc.id)}
                className={cn("group flex w-[72%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-white text-start shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:w-auto", active ? "border-brand-teal ring-2 ring-brand-teal/30" : "border-brand-border")}
              >
                <div className="relative">
                  <img src={cfg?.image ?? genCategoryImageUrl(sc.image)} alt="" className="aspect-[12/5] w-full object-cover" />
                  <span className="absolute -bottom-5 start-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-green-soft text-brand-teal ring-4 ring-white">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-7">
                  <h3 className="text-lg font-extrabold leading-tight text-brand-navy">{cfg ? ts(`${cfg.key}T`) : getLocalizedValue(sc.nameI18n, locale)}</h3>
                  {cfg && <p className="mt-1.5 flex-1 text-sm leading-snug text-brand-navy-2/80">{ts(`${cfg.key}X`)}</p>}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal">
                    {ts("explore")}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Listing */}
      <section id="supplies-listing" className="container mx-auto scroll-mt-20 px-4 py-10 md:px-6 md:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <aside className="hidden md:col-span-4 md:block lg:col-span-3">
            <div className="sticky top-20 rounded-2xl border border-brand-border bg-white p-5 shadow-sm">{filters("d")}</div>
          </aside>

          <div className="md:col-span-8 lg:col-span-9">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">{ts("listTitle")}</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t('search-products')}
                    className="w-full ps-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="md:hidden">
                        <Filter className="h-4 w-4" />
                        {t('filters')}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side={locale === "ar" ? "right" : "left"} className="overflow-y-auto p-5">{filters("m")}</SheetContent>
                  </Sheet>
                  <span className="hidden whitespace-nowrap text-sm text-brand-navy-2 sm:inline">{t('sort-by-0')}</span>
                  <div className="flex-1 sm:flex-none">{sortSelect}</div>
                </div>
              </div>
            </div>

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
              containerClassName="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 2xl:grid-cols-4"
              customEmptyStateComponent={
                <PublicFilteredProductsEmpty />
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}
