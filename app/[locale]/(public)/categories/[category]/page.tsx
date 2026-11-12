import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/db"
import CategoryPage from "@/components/categories/category-page"
import { getTenantId } from "@/lib/tenant"
import { getTranslations } from "next-intl/server"

type Props = {
  "params":Promise<{"category":string,"locale":string}>,
  "searchParams":Promise<any>
}

export const dynamic = 'force-dynamic';
export default async function page({params,searchParams}:Props) {
  const [{ category, locale }, storeId] = await Promise.all([
    params,
    getTenantId()
  ]) 
  const [currentCategory,_storeDisplaySettings] = await Promise.all([
    db.query.categories.findFirst({
      "with":{
        "subcategories":true
      },
      "where":(categories,{eq,and})=>and(
        eq(categories.id,category),
        eq(categories.storeId,storeId),
      )
    }),
    db.query.storeDisplaySettings.findFirst({
      "where":(storeDisplaySettings,{eq})=>eq(storeDisplaySettings.storeId,storeId)
    })
  ]) 

  const t = await getTranslations({locale})

  if (!currentCategory) {
    return (
      <div className="container flex items-center justify-center px-4 py-24 md:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('category-not-found')}</h1>
          <p className="text-muted-foreground">{t('the-category-you-are-looking-for-does-not-exist')}</p>
          <Button asChild className="mt-4">
            <Link href={`/${locale}/categories`}>{t('back-to-categories')}</Link>
          </Button>
        </div>
      </div>
    )
  }
  // const categoryFilters = await searchParams

  // const productsPromise = (async ()=> {
  //   await sleep(10000)
  //   return []
  // })()

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <CategoryPage detailedProducts={_storeDisplaySettings?.productStyle === "detailed"} category={currentCategory}>
        {/* <Suspense
          key={JSON.stringify(categoryFilters)}
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CategoryProductsSkeleton/>
            </div>
          }
        >
          <CategoryProducts productsPromise={productsPromise}/>
        </Suspense> */}
      </CategoryPage>
    </div>
  )
}
