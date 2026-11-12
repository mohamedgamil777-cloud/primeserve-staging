"use client"
import { useTranslations } from "next-intl"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useOrders } from '@/hooks/use-orders'
import { range } from '@/lib/utils'
import { CustomerOrderSkeleton } from './customer-order-skeleton'
import { CustomerOrdersEmpty } from '../empty-states/customer-empty-states'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import CustomerOrder from './customer-order'
import { useLocale } from 'next-intl'

type Props = {}

export default function RecentOrders({}: Props) {
  const tu = useTranslations("ui")
  const locale = useLocale()
  const { isLoading, data } = useOrders({})
  const last5Orders = data?.pages?.flatMap(pg=>pg).flatMap(item=>item).slice(0,5) ?? []
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tu("recentOrders")}</CardTitle>
        <CardDescription>{tu("recentPurchases")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {
            isLoading
            ?
            range(0,5).map(idx=>(
              <CustomerOrderSkeleton key={idx}/>
            ))
            :
            last5Orders.length === 0
            ?
            <CustomerOrdersEmpty/>
            :
            last5Orders.map(order=>(
              <CustomerOrder key={order.id} order={order}/>
            ))
          }          
        </div>
        <div className="mt-4 text-center">
          <Button variant="link" asChild>
            <Link href={`/${locale}/account/orders`}>
              View All Orders
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}