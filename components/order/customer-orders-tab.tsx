import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import InfiniteScrollContainer from '../common/infinite-scroll-container'
import { CustomerOrderSkeleton } from './customer-order-skeleton'
import CustomerOrder from './customer-order'
import { useOrders } from '@/hooks/use-orders'
import { OrderSort, OrderStatus } from '@/types/order'

type Props = {
  title:string,
  description:string,
  status:OrderStatus,
  sort:OrderSort,
  q?:string
}

export default function CustomerOrdersTab({title,description,sort,status,q}: Props) {
  const query = useOrders({
    sort,status,query:q
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <InfiniteScrollContainer
          containerClassName=" grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1"
          skeletonClassName=' bg-background'
          customSkeletonComponent={<CustomerOrderSkeleton/>}
          query={query}
          keyExtractor={(order)=>order.id}
          renderItem={(order)=><CustomerOrder order={order}/>}              
          customEmptyStateComponent={
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">You don't have any {!["all","pending","shipped"].includes(status) ? status : ""} orders {status === "pending" ? "being processed" : status === "shipped" ? "out for delivery" : ""} at the moment.</p>
            </div>
          }
        />
      </CardContent>
    </Card>
  )
}