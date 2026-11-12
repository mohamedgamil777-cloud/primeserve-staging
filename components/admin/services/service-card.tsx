"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/hooks/use-locale'
import { genServiceImageUrl } from '@/lib/service'
import { getLocalizedValue } from '@/types/internationalization'
import { ServicePublicItem } from '@/types/services'
import { Clock, DollarSign } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

type Props = {
  service:ServicePublicItem,
  detailed?:boolean
}

export default function ServiceCard({service,detailed}: Props) {
  const t = useTranslations()
  const locale = useLocale()
  return (
    <Card key={service.id} className="h-full flex flex-col hover:shadow-lg transition-shadow pt-0">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={genServiceImageUrl(service.images.at(0)?.src) || "/placeholder.png"}
          alt={getLocalizedValue(service.nameI18n,locale)}
          className="object-cover w-full h-full"
        />
        {/* <Badge className="absolute top-2 right-2">{service.type}</Badge> */}
      </div>

      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-lg font-bold">{getLocalizedValue(service.nameI18n,locale)}</CardTitle>
        <CardDescription className="text-sm">{getLocalizedValue(service.shortDescriptionI18n,locale)}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.pricingModel === "quote" ? (
              null
              // <Badge variant="outline">Quote Required</Badge>
            ) : (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">{service.price}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {service.estimatedDuration}
          </div>
        </div>
        {
          detailed
          &&
          <>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < Math.floor(service.rating ?? 0) ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground">
                {service.rating} ({service.reviewCount})
              </span>
            </div>

            <div className="space-y-1">
              {service.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  {feature}
                </div>
              ))}
            </div>
          </>
        }
      </CardContent>

      <CardFooter className="mt-auto pt-2">
        <Button className="w-full" asChild>
          <Link href={`/${locale}/services/${service.id}${!detailed ? (service.pricingModel === "quote" ? "/quote" : "/request") : ""}`}>{service.pricingModel === "quote" ? t('request-quote') : t('book-now')}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}