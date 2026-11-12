"use client"
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Gift } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {}

export default function RedeemedRewardsEmpty({}: Props) {
  const t = useTranslations()
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('no-redeemed-rewards')}</h3>
        <p className="text-muted-foreground">
          {t('you-havent-redeemed-any-rewards-yet-check-out-the-available-rewards-to-start-saving')}
        </p>
      </CardContent>
    </Card>
  )
}