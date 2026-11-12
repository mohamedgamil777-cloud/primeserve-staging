"use client"
import Autoplay from "embla-carousel-autoplay"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ProductItem } from "@/types/product"
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel"
import { useLocale, useTranslations } from "next-intl"

type Props = {
  products:ProductItem[],
  detailed?:boolean
}

export function FeaturedProducts({products,detailed}:Props) {
  const locale = useLocale()
  const t = useTranslations()
  const isLoading = false
  return (
    <section className="py-10 md:py-14">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter text-[#0B1F33] sm:text-3xl">{t('featured-products')}</h2>
            {/* <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover our handpicked selection of trending items
            </p> */}
          </div>
        </div>
        {
          isLoading
          ?
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {
              Array(8)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="space-y-3">
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
                ))

            }
          </div>
          :
          <Carousel 
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            opts={{"align":"start","direction":locale === "ar" ? "rtl" : "ltr"}}
            className="mt-6"
          >
            <CarouselContent className="-ml-3 sm:-ml-4">
              {
                products?.map((product, index) => (
                  <CarouselItem key={product.id} className="basis-1/2 pl-3 sm:basis-1/3 sm:pl-4 lg:basis-1/4 xl:basis-1/5">
                    <ProductCard compact detailed={detailed} product={product} index={index} />
                  </CarouselItem>
                ))
              }
            </CarouselContent>
          </Carousel>
        }
        <div className="relative z-10 mt-8 flex justify-center">
          <Button asChild size="lg" className="h-11 rounded-xl bg-[#0B1F33] px-6 text-white hover:bg-[#0B1F33]/90">
            <Link href={`/${locale}/products`}>{t('view-all-products')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
