"use client"
import { Card, CardContent } from '@/components/ui/card'
import { PointEarningMethod } from '@/types/pointEarningMethod'
import { Calendar, Gift, LogIn, Share2, ShoppingBag, Star, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

type Props = {
  method:PointEarningMethod
}


export const getTypeIcon = (type: string) => {
  switch (type) {
    case "purchase":
      return <ShoppingBag className="h-6 w-6 text-primary"/>
    case "review":
      return <Star className="h-6 w-6 text-primary"/>
    case "signup":
      return <LogIn className="h-6 w-6 text-primary"/>
    case "referral":
      return <Share2 className="h-6 w-6 text-primary"/>
    case "birthday":
      return <Calendar className="h-6 w-6 text-primary"/>
    case "social":
      return <Gift className="h-6 w-6 text-primary"/>
    default:
      return "🎯"
  }
}


export default function PointEarningMethodCard({method}: Props) {
  const t = useTranslations()
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {getTypeIcon(method.type)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{method.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-primary">{
                method.type === "purchase"
                ?
                `${method.pointsPerDollar} ${t('point-per-dollar')}`
                :
                `${method.pointsAwarded} ${t('points')}`
              }</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}