import React from 'react'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { genCategoryImageUrl } from '@/lib/category'
import { ExistingSubCategory } from '@/types/subcategory'
import { getLocalizedValue } from '@/types/internationalization'
import { useLocale } from '@/hooks/use-locale'
import { useTranslations } from 'next-intl'

type Props = {
  subcategory:Pick<ExistingSubCategory,"id"|"productCount"|"image"|"nameI18n">,
  className?:string
}

export default function SubCategoryCard({subcategory,className}: Props) {
  const locale = useLocale()
  const t = useTranslations("ui")
  return (
    <Card className={cn("overflow-hidden h-full group py-0",className)}>
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={genCategoryImageUrl(subcategory.image)}
            alt={getLocalizedValue(subcategory.nameI18n,locale)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold sm:text-lg">{getLocalizedValue(subcategory.nameI18n,locale)}</h3>
            <p className="text-sm text-white/80">{t("productsCount",{count:subcategory.productCount ?? 0})}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}