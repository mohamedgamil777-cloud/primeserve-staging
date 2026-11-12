"use client"
import InfiniteScrollTable from '@/components/common/infinite-scroll-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrders } from '@/hooks/use-orders'
import { formatDate } from '@/lib/date'
import { Eye } from 'lucide-react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import React from 'react'

type Props = {
  customerId:string
}

export default function CustomerOrderHistory({customerId}: Props) {
  const locale = useLocale()
  const query = useOrders({customerId})
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View all orders placed by this customer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <InfiniteScrollTable
            query={query}
            cols={[
              {
                "order":1,
                "head":"Order ID",
                "cell":(all,order)=>(
                  order.code
                ),
                "cellClassName":()=>"font-medium text-left"
              },
              {
                "order":2,
                "head":"Date",
                "cell":(all,order)=>(
                  formatDate(order.createdAt)
                ),
                "cellClassName":()=>"text-left"
              },
              {
                "order":3,
                "head":"Items",
                "cell":(all,order)=>(
                  order.productsCount.toLocaleString()
                ),
                "cellClassName":()=>"text-left"
              },
              {
                "order":4,
                "head":"Total",
                "cell":(all,order)=>(
                  order.totalAmount.toLocaleString()
                ),
                "cellClassName":()=>"text-left"
              },
              {
                "order":5,
                "head":"Status",
                "cell":(all,order)=>(
                    <Badge
                      variant={
                        order.status === "processing"
                          ? "default"
                          : order.status === "shipped"
                            ? "secondary"
                            : order.status === "delivered"
                              ? "outline"
                              : "destructive"
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                ),
                "cellClassName":()=>"text-left"
              },
              {
                "order":6,
                "head":"Actions",
                "cell":(all,order)=>(
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/${locale}/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                ),
                "headClassName":"text-right",
                "cellClassName":()=>"text-right"
              },
            ]}
          />          
        </div>
      </CardContent>
    </Card>

  )
}