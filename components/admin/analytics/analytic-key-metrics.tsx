"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnalytics } from '@/hooks/use-analytics'
import { AnalyticsRange } from '@/types/analytics'
import { DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, Users } from 'lucide-react'
import React, { useMemo } from 'react'

type Props = {
  range:AnalyticsRange
}

export function Trend({cur,prev,period}:{cur:number,prev:number,period:string}){
  if(cur > prev) return (
    <p className="text-xs text-muted-foreground flex items-center">
      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
      +{(cur * 100 / Math.max(prev,1)).toLocaleString()}% from last {period}
    </p>
  )
  else if(cur < prev) return (
    <p className="text-xs text-muted-foreground flex items-center">
      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
      -{(prev * 100 / Math.max(cur,1)).toLocaleString()}% from last {period}
    </p>
  )
  return <></>
}


export default function AnalyticKeyMetrics({range}: Props) {
  const { isLoading, data } = useAnalytics(range)
  const sums = useMemo(()=>({
    "current":{
      "revenue":data?.current.reduce((acc,cur)=>acc+Number(cur["revenue"]),0) ?? 0,
      "orders":data?.current.reduce((acc,cur)=>acc+Number(cur["orders"]),0) ?? 0,
      "newCustomers":data?.current.reduce((acc,cur)=>acc+Number(cur["newCustomers"]),0) ?? 0,
      "returningCustomers":data?.current.reduce((acc,cur)=>acc+Number(cur["returningCustomers"]),0) ?? 0,
    },
    "previous":{
      "revenue":data?.previous.reduce((acc,cur)=>acc+Number(cur["revenue"]),0) ?? 0,
      "orders":data?.previous.reduce((acc,cur)=>acc+Number(cur["orders"]),0) ?? 0,
      "newCustomers":data?.previous.reduce((acc,cur)=>acc+Number(cur["newCustomers"]),0) ?? 0,
      "returningCustomers":data?.previous.reduce((acc,cur)=>acc+Number(cur["returningCustomers"]),0) ?? 0,
    }
  }),[data])
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">EGP {sums.current.revenue.toLocaleString()}</div>
          <Trend cur={sums.current.revenue} prev={sums.previous.revenue} period={range} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{sums.current.orders.toLocaleString()}</div>
          <Trend cur={sums.current.orders} prev={sums.previous.orders} period={range} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{sums.current.newCustomers.toLocaleString()}</div>
          <Trend cur={sums.current.newCustomers} prev={sums.previous.newCustomers} period={range} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Returning Customers</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{sums.current.returningCustomers.toLocaleString()}</div>
          <Trend cur={sums.current.returningCustomers} prev={sums.previous.returningCustomers} period={range}/>
        </CardContent>
      </Card>
    </div>

  )
}