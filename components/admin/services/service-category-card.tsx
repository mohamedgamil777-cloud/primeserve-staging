"use client"
import { Card, CardContent } from '@/components/ui/card'
import { useLocale } from '@/hooks/use-locale'
import { genCategoryImageUrl } from '@/lib/category'
import { cn } from '@/lib/utils'
import { getLocalizedValue } from '@/types/internationalization'
import { DetailedServiceCategory } from '@/types/serviceCategory'
import Link from 'next/link'
import React from 'react'

type Props = {
  category:Pick<DetailedServiceCategory,"id"|"icon"|"nameI18n"|"servicesCount"|"descriptionI18n"|"slug"|"image">,
  className?:string
}

export default function ServiceCategoryCard({category,className}: Props) {
  const locale = useLocale()
  return (
    <Link href={`/${locale}/services/category/${category.id}`}>
      <Card className={cn("overflow-hidden h-full group py-0",className)}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={genCategoryImageUrl(category.image)}
              alt={getLocalizedValue(category.nameI18n,locale)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-bold">{getLocalizedValue(category.nameI18n,locale)}</h3>
              {/* <p className="text-sm text-white/80">{category.servicesCount} services</p> */}
              <p className="text-sm text-white/80 sm:inline hidden">{getLocalizedValue(category.descriptionI18n,locale)?.slice(0,50)}...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}