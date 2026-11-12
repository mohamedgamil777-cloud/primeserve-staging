"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { DetailedCategory } from "@/types/category"
import FeaturedCategoryCard from "./featured-category-card"
import SubCategoryCard from "./sub-category-card"
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
    <section className="py-12 md:py-16">
      {
        isExtended
        ?
        categories.map(category=>(
          <div key={category.id} className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-start justify-center space-y-4 text-start">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#0B1F33] sm:text-4xl">{getLocalizedValue(category.nameI18n,locale)}</h2>
                <p className="max-w-[900px] text-[#667085] md:text-lg">
                  {getLocalizedValue(category.descriptionI18n,locale)}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
              {category.subcategories.map((subcategory, index) => (
                <motion.div
                  key={subcategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
                >
                  <Link href={`/${locale}/categories/${category.id}?sc=${subcategory.id}`}>
                    <SubCategoryCard
                      className="cursor-pointer"
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
          <div className="flex flex-col items-start justify-center space-y-4 text-start">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-[#0B1F33] sm:text-4xl">{t('shop-by-category')}</h2>
              <p className="max-w-[900px] text-[#667085] md:text-lg">
                {t('browse-our-collections-and-find-your-perfect-style')}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
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
