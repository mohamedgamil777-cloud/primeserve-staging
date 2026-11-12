import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CategoriesList from "@/components/categories/categories-list"
import { db } from "@/db"
import { range } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { getTranslations } from "next-intl/server"

export const dynamic = 'force-dynamic';
export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const categoriesPromise = db.query.categories.findMany({
    "with":{
      "subcategories":true
    }
  })
  const t = await getTranslations({locale})
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{t('categories')}</h1>
          <p className="text-muted-foreground">{t('browse-our-collections-and-find-your-perfect-style')}</p>
        </div>

        <Suspense fallback={          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {range(0,11).map(idx=>(<Skeleton key={idx} className=" h-96 w-full rounded-lg"/>))}
          </div>
        }>
          <CategoriesList categoriesPromise={categoriesPromise}/>
        </Suspense>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('cant-find-what-youre-looking-for')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('browse-all-our-products-or-contact-our-customer-support-team-for-assistance')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href={`/${locale}/products`}>{t('browse-all-products')}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/${locale}/contact`}>{t('contact-support')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
