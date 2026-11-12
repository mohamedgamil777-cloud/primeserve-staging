"use client"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TierItem } from '@/types/tier'
import { useTranslations } from 'next-intl'
import React from 'react'

type Props = {
  tier:TierItem,
  isCurrentTier?:boolean
}

export default function TierCard({isCurrentTier,tier}: Props) {
  const t = useTranslations()
  return (
    <Card className={isCurrentTier ? "ring-2 ring-primary" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn(`w-4 h-4 rounded-full`)} style={{backgroundColor:tier.color}} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              {isCurrentTier && <Badge variant="default">{t('current')}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              {tier.minPoints.toLocaleString()}{t('points-required')}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {tier.benefits.map((benefit, benefitIndex) => (
                <Badge key={benefitIndex} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}