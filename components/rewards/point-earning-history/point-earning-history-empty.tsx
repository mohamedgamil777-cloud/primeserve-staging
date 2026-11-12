"use client"
import React from 'react'
import { Gift } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

type Props = {}

export default function PointEarningHistoryEmpty({}: Props) {
  const t = useTranslations()
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('no-earning-history')}</h3>
        <p className="text-muted-foreground">
          {t('you-havent-earned-any-points-yet-check-out-the-available-earning-methods-to-start-saving')}
        </p>
      </CardContent>
    </Card>
  )
}