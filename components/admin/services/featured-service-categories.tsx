"use client"

import { motion } from "framer-motion"
import { DetailedServiceCategory } from "@/types/serviceCategory"
import ServiceCategoryCard from "./service-category-card"
import { useTranslations } from "next-intl"

export function FeaturedServiceCategories({categories}:{categories:Pick<DetailedServiceCategory,"id"|"icon"|"nameI18n"|"servicesCount"|"descriptionI18n"|"slug"|"image">[]}) {
  const t = useTranslations()
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-start justify-center space-y-4 text-start">
          <div className="space-y-2">
            {/* <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Book a Service</h2> */}
            <h2 className="text-3xl font-bold tracking-tighter text-[#0B1F33] sm:text-4xl">{t('services')}</h2>
            <p className="max-w-[900px] text-[#667085] md:text-lg">
              {t('professional-services-you-can-trust')}
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
              className="w-[calc(50%-8px)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <ServiceCategoryCard category={category}/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
