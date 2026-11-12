"use client"
import { useTranslations } from "next-intl"
import { OrderItem } from '@/types/order'
import React from 'react'
import { Badge } from '../ui/badge'
import { formatDate } from '@/lib/date'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import OrderCanceler from './order-canceler'

type Props = {
  order:OrderItem
}

export default function CustomerOrder({order}: Props) {
  const tu = useTranslations("ui")
  const locale = useLocale()
  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Order #{order.code}</h3>
            <Badge
              variant={
                order.status === "pending"
                  ? "default"
                  : order.status === "shipped"
                    ? "secondary"
                    : order.status === "delivered" || order.status === "paid"
                      ? "outline"
                      : "destructive"
              }
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
          <p className="text-sm mt-2">
            {order.productsCount} items • Total: EGP {order.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/account/orders/${order.id}`}>{tu("viewDetails")}</Link>
          </Button>
          { order.status === "pending" 
            && 
            <OrderCanceler order={order}>
              <Button variant={"destructive"} size="sm">{tu("cancel")}</Button>
            </OrderCanceler>
          }
          {order.status === "delivered" && <Button size="sm">{tu("buyAgain")}</Button>}
        </div>
      </div>
    </div>
  )
}