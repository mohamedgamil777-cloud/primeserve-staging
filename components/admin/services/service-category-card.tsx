"use client"
import { Card, CardContent } from '@/components/ui/card'
import { useLocale } from '@/hooks/use-locale'
import { genCategoryImageUrl } from '@/lib/category'
import { cn } from '@/lib/utils'
import { getLocalizedValue } from '@/types/internationalization'
import { DetailedServiceCategory } from '@/types/serviceCategory'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

type Props = {
  category:Pick<DetailedServiceCategory,"id"|"icon"|"nameI18n"|"servicesCount"|"descriptionI18n"|"slug"|"image">,
  className?:string
}

// Photo on top, name and a short description below on white, so the text is never squeezed over the image.
export default function ServiceCategoryCard({category,className}: Props) {
  const locale = useLocale()
  const t = useTranslations("ui")
  const name = getLocalizedValue(category.nameI18n,locale)
  const description = getLocalizedValue(category.descriptionI18n,locale)
  return (
    <Link href={`/${locale}/services/category/${category.id}`} className="block h-full">
      <Card className={cn("group h-full gap-0 overflow-hidden border-[#E5E7EB] py-0 transition-shadow hover:shadow-lg",className)}>
        <div className="relative aspect-[16/10] overflow-hidden bg-[#EEF2F6]">
          <img
            src={genCategoryImageUrl(category.image)}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="flex flex-1 flex-col gap-1.5 p-3 sm:p-5">
          <h3 className="font-bold text-[#0B1F33] sm:text-lg">{name}</h3>
          {description && (
            <p className="hidden text-sm text-[#667085] line-clamp-2 sm:[display:-webkit-box]">{description}</p>
          )}
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-[#F26522]">
            {t("viewServices")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
