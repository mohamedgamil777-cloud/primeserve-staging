import { Button } from "@/components/ui/button"
import { FeaturedProducts } from "@/components/featured-products"
import { FeaturedCategories } from "@/components/categories/featured-categories"
import { Newsletter } from "@/components/newsletter"
import { db } from "@/db"
import { serviceCategories, services } from "@/db/schema"
import { and, eq, isNull, sql } from "drizzle-orm"
import { getTenantId } from "@/lib/tenant"
import { FeaturedServiceCategories } from "@/components/admin/services/featured-service-categories"
import HrmsAppAd from "@/components/hrms-app-ad"
import BudgetManagementAd from "@/components/budgets/budget-management-ad"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import YouTubeVideo from "@/components/common/youtube-video"
import { cn } from "@/lib/utils"
import Image from "next/image"
import workplaceBanner from "@/public/imgs/banners/workplace-platform.webp"

export const dynamic = 'force-dynamic';
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [storeId,t] = await Promise.all([
    getTenantId(),
    getTranslations({locale})
  ])
  const [_categories,_featuredProducts,_serviceCategories,_store] = await Promise.all([
    db.query.categories.findMany({
      "with":{
        "subcategories":true,
      },
      "where":(categories,{and,eq})=> and(
        eq(categories.storeId,storeId),
        eq(categories.featured,true),
      )
    }),
    db.query.products.findMany({
      "where":(products,{eq})=>eq(products.storeId,storeId),
      "with":{
        "category":{
          "columns":{
            "nameI18n":true
          }
        }
      },
      "limit":8
    }),
    db
      .select({
        "isActive":serviceCategories.isActive,
        "isFeatured":serviceCategories.isFeatured,
        "slug":serviceCategories.slug,
        id: serviceCategories.id,
        nameI18n: serviceCategories.nameI18n,
        descriptionI18n: serviceCategories.descriptionI18n,
        icon: serviceCategories.icon,
        image: serviceCategories.image,
        createdAt: serviceCategories.createdAt,
        servicesCount: sql<number>`COUNT(${services.id})`.as('servicesCount'),
      })
      .from(serviceCategories)
      .where(
        and(
          eq(serviceCategories.storeId,storeId),
          eq(serviceCategories.isFeatured,true),
        )
      )
      .leftJoin(services, sql`${services.categoryId} = ${serviceCategories.id}`)
      .groupBy(serviceCategories.id)
      .orderBy(serviceCategories.nameI18n),
    db.query.stores.findFirst({
      "where":(stores,{eq})=>eq(stores.id,storeId),
      "with":{
        "storeAssets":true,
        "storeDisplaySettings":true,
      }
    })
  ]) 

  return (
    <main className="flex min-h-screen flex-col">
      {/* Main hero is the workplace platform banner. The old text hero (HeroSection) is kept in the code but not shown. */}
      <section className="bg-white">
        <Link href={`/${locale}/support`} className="block">
          <Image
            src={workplaceBanner}
            alt="PrimeServe: one platform for every workplace"
            sizes="100vw"
            priority
            className="h-auto w-full"
          />
        </Link>
      </section>
      <Link href={"/account/rewards"}>
        <div className="bg-[#0B1F33] font-bold text-white gap-4 px-4 py-2 flex items-center justify-center">
          <span className="text-sm sm:text-base">
            Earn points on every order. Join our Loyalty Program today.
          </span>
          <button className="">
            Sign in
          </button>
        </div>
      </Link>
      <div className={cn("container px-4 md:px-6 mx-auto py-16 space-y-0 flex flex-col items-start justify-center text-left",locale === "ar" && "text-right")}>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t("ui.howItWorks")}</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t("ui.howItWorksText")}
          </p>
        </div>
      </div>
      <div className="container mx-auto p-4 max-w-4xl shadow-md">
        {/* <h1 className="text-2xl font-bold mb-4">Responsive YouTube Video</h1> */}
        <YouTubeVideo videoId="W-uTUPGkQJc" />
      </div>

      <FeaturedServiceCategories categories={_serviceCategories}/>
      {
        _categories.length > 0
        &&
        <FeaturedCategories isExtended={_store?.storeDisplaySettings?.categoryStyle === "detailed"} categories={_categories} />
      }
      <section className="container px-4 md:px-6 mx-auto py-16 space-y-16">
        <HrmsAppAd/>
        <BudgetManagementAd/>
      </section>
      {
        !!_store?.storeDisplaySettings?.showFeaturedProducts &&  _featuredProducts.length > 0 
        &&
        <FeaturedProducts detailed={_store?.storeDisplaySettings?.productStyle === "detailed"} products={_featuredProducts} />
      }
      <section className="py-16 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{_store?.storeAssets?.heroTitle ?? t('shop-the-latest-trends')}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {_store?.storeAssets?.heroDescription ?? t('discover-our-newest-arrivals-and-best-sellers-quality-products-at-competitive-prices')}
              </p>
            </div>
            <Link href={`/${locale}/${_store?.storeAssets?.heroMainButtonLink ?? "#"}`}>
              <Button size="lg" className="mt-4">
                {_store?.storeAssets?.heroMainButtonText}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* <DownloadAppSection /> */}
      <Newsletter />
    </main>
  )
}
