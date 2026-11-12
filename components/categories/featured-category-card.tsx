"use client"
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { DetailedCategory, ExistingCategory } from '@/types/category'
import { useLocale } from '@/hooks/use-locale'
import { useTranslations } from 'next-intl'
import { getLocalizedValue } from '@/types/internationalization'

type Props = {
  category:DetailedCategory
}

export default function FeaturedCategoryCard({category}: Props) {
  const locale = useLocale()
  const t = useTranslations("ui")
  return (
    <Card className="overflow-hidden h-full group py-0">
      <CardContent className="p-0">
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10" />
          <img
            src={category.image ? `/api/imgs/categories/${category.image}`  : "/placeholder.png"}
            alt={getLocalizedValue(category.nameI18n,locale)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
            <h3 className="text-2xl font-bold">{getLocalizedValue(category.nameI18n,locale)}</h3>
            <p className="text-sm text-white/80">{t("productsCount",{count:category.subcategories.reduce((acc,cur)=>acc+cur["productCount"],0)})}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
  )
}