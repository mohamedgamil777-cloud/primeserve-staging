"use client"
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { RedeemedRewardItem } from '@/types/reward'
import { Badge } from '../ui/badge'
import { useTranslations } from 'next-intl'

type Props = {
  reward:RedeemedRewardItem
}

export default function RedeemedRewardCard({reward}: Props) {
  const t = useTranslations()
  const isExpired = reward.expiresAt ? new Date(reward.expiresAt) < new Date() : false
  const daysUntilExpiry = !reward.expiresAt ? 100 : Math.ceil(
    (new Date(reward.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )
  return (
    <Card className={isExpired ? "opacity-50" : ""}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{reward.reward?.name}</h3>
              {reward.used ? (
                <Badge variant="secondary">{t('used')}</Badge>
              ) : isExpired ? (
                <Badge variant="destructive">{t('expired')}</Badge>
              ) : (
                <Badge variant="default">{t('available')}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{reward.reward?.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* <div>
                <span className="text-muted-foreground">Reward Code:</span>
                <p className="font-mono font-medium">{reward.code}</p>
              </div> */}
              <div>
                <span className="text-muted-foreground">{t("redeemed")}:</span>
                <p>{new Date(reward.redeemedAt!).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("expires")}:</span>
                <p
                  className={isExpired ? "text-red-600" : daysUntilExpiry <= 7 ? "text-orange-600" : ""}
                >
                  {new Date(reward.expiresAt!).toLocaleDateString()}
                  {!isExpired && !reward.used && (
                    <span className="ml-1">
                      ({daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""} left)
                    </span>
                  )}
                </p>
              </div>
              {reward.used && (
                <div>
                  <span className="text-muted-foreground">{t('used-on')}</span>
                  <p>{new Date(reward.order?.createdAt!).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Order: {reward.order?.code}</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">{t('cost')}</p>
            <p className="font-semibold">{reward.reward?.pointsCost} pts</p>
          </div>
        </div>
      </CardContent>
    </Card>

  )
}