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
import { ArrowRight, ClipboardCheck, Layers, Search, ShieldCheck, Truck, Users } from "lucide-react"
import Image from "next/image"
import heroDevices from "@/public/imgs/banners/hero-devices.webp"

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

  const steps = [
    { icon: Search, title: t("ui.step1Title"), text: t("ui.step1Text") },
    { icon: ClipboardCheck, title: t("ui.step2Title"), text: t("ui.step2Text") },
    { icon: Truck, title: t("ui.step3Title"), text: t("ui.step3Text") },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero: text and buttons are real HTML, the device picture sits beside them and stacks under on phones. */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto grid items-center gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-14">
          <div className="space-y-5 text-center lg:text-start">
            <span className="inline-block rounded-full bg-[#E8F5F3] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#00796B] sm:text-sm">
              {t("ui.heroBadge")}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0B1F33] sm:text-5xl xl:text-6xl">
              {t("ui.heroTitle1")}
              <br />
              <span className="text-[#F26522]">{t("ui.heroTitle2a")}</span>{" "}
              <span className="text-[#00796B]">{t("ui.heroTitle2b")}</span>
            </h1>
            <p className="mx-auto max-w-xl text-base text-[#667085] sm:text-lg lg:mx-0">
              {t("ui.heroText")}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href={`/${locale}/support`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F26522] px-6 font-semibold text-white shadow-sm transition-colors hover:bg-[#d9541a]"
              >
                {t("ui.bookDemo")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#0B1F33] px-6 font-semibold text-[#0B1F33] transition-colors hover:bg-[#0B1F33] hover:text-white"
              >
                {t("ui.exploreSolutions")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 text-sm font-medium text-[#0B1F33] lg:justify-start">
              <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#00796B]" />{t("ui.trustSecure")}</li>
              <li className="flex items-center gap-2"><Layers className="h-5 w-5 text-[#00796B]" />{t("ui.trustScalable")}</li>
              <li className="flex items-center gap-2"><Users className="h-5 w-5 text-[#00796B]" />{t("ui.trustUsers")}</li>
            </ul>
          </div>
          <div className="relative">
            <Image
              src={heroDevices}
              alt={t("ui.heroAlt")}
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
      <Link href={`/${locale}/account/rewards`} className="block bg-[#0B1F33] px-4 py-2.5 text-white">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm font-semibold sm:text-base">
          <span>{t("ui.loyaltyText")}</span>
          <span className="text-[#F26522] underline-offset-4 hover:underline">{t("ui.loyaltyCta")}</span>
        </div>
      </Link>

      <FeaturedServiceCategories categories={_serviceCategories}/>
      {
        _categories.length > 0
        &&
        <FeaturedCategories isExtended={_store?.storeDisplaySettings?.categoryStyle === "detailed"} categories={_categories} />
      }

      {/* How it works: a smaller video with the three steps beside it. */}
      <section className="bg-[#F8FAFC] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-[#0B1F33] sm:text-4xl">{t("ui.howItWorks")}</h2>
            <p className="mx-auto max-w-2xl text-[#667085] md:text-lg">{t("ui.howItWorksText")}</p>
          </div>
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl bg-white shadow-md">
              <YouTubeVideo videoId="W-uTUPGkQJc" />
            </div>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF3EC] text-[#F26522]">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-[#0B1F33]">{i + 1}. {step.title}</h3>
                    <p className="text-sm text-[#667085]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-6 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-2">
        <HrmsAppAd/>
        <BudgetManagementAd/>
      </section>
      {
        !!_store?.storeDisplaySettings?.showFeaturedProducts &&  _featuredProducts.length > 0 
        &&
        <FeaturedProducts detailed={_store?.storeDisplaySettings?.productStyle === "detailed"} products={_featuredProducts} />
      }

      {/* Closing call to action */}
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-[#0B1F33] px-6 py-12 text-center text-white md:px-12">
          <div className="absolute -top-16 h-48 w-48 rounded-full bg-[#F26522]/20 ltr:-right-16 rtl:-left-16" />
          <div className="absolute -bottom-20 h-56 w-56 rounded-full bg-white/5 ltr:-left-20 rtl:-right-20" />
          <div className="relative space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("ui.ctaTitle")}</h2>
            <p className="mx-auto max-w-2xl text-white/80 md:text-lg">{t("ui.ctaText")}</p>
            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <Link
                href={`/${locale}/services`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#F26522] px-6 font-semibold text-white transition-colors hover:bg-[#d9541a]"
              >
                {t("ui.exploreSolutions")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white px-6 font-semibold text-white transition-colors hover:bg-white hover:text-[#0B1F33]"
              >
                {t("ui.shopSupplies")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* <DownloadAppSection /> */}
      <Newsletter />
    </main>
  )
}
