"use client"

import { motion } from "framer-motion"
import { DetailedServiceCategory } from "@/types/serviceCategory"
import ServiceCategoryCard from "./service-category-card"
import { useTranslations } from "next-intl"
import { useLocale } from "@/hooks/use-locale"
import { cn } from "@/lib/utils"

export function FeaturedServiceCategories({categories}:{categories:Pick<DetailedServiceCategory,"id"|"icon"|"nameI18n"|"servicesCount"|"descriptionI18n"|"slug"|"image">[]}) {
  const t = useTranslations()
  const locale = useLocale()
  return (
    <section className="py-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className={cn("flex flex-col items-start justify-center space-y-4 text-left",locale === "ar" && "text-right")}>
          <div className="space-y-2">
            {/* <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Book a Service</h2> */}
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('services')}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('professional-services-you-can-trust')}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ServiceCategoryCard category={category}/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
