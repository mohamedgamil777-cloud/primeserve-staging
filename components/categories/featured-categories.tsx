"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { DetailedCategory } from "@/types/category"
import FeaturedCategoryCard from "./featured-category-card"
import SubCategoryCard from "./sub-category-card"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"

type Props = {
  categories:DetailedCategory[],
  isExtended:boolean
}

export function FeaturedCategories({categories,isExtended}:Props) {
  const t = useTranslations()
  const locale = useLocale()
  return (
    <section className="py-8">
      {
        isExtended
        ?
        categories.map(category=>(
          <div key={category.id} className="container px-4 md:px-6 mx-auto">
            <div className={cn("flex flex-col items-start justify-center space-y-4 text-left",locale === "ar" && "text-right")}>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{getLocalizedValue(category.nameI18n,locale)}</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {getLocalizedValue(category.descriptionI18n,locale)}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {category.subcategories.map((subcategory, index) => (
                <motion.div
                  key={subcategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/${locale}/categories/${category.id}?sc=${subcategory.id}`}>
                    <SubCategoryCard
                      className={cn("cursor-pointer")}
                      subcategory={subcategory}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))
        :
        <div className="container px-4 md:px-6 mx-auto">
          <div className={cn("flex flex-col items-center justify-center space-y-4 text-left",locale === "ar" && "text-right")}>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('shop-by-category')}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('browse-our-collections-and-find-your-perfect-style')}
              </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/${locale}/categories/${category.id}`}>
                  <FeaturedCategoryCard category={category}/>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      }
    </section>
  )
}
