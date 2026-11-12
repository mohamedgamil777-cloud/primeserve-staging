"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueChart } from "@/components/admin/analytics/revenue-chart"
import { OrdersChart } from "@/components/admin/analytics/orders-chart"
import { TopProducts } from "@/components/admin/analytics/top-products"
import { CustomerAnalytics } from "@/components/admin/analytics/customer-analytics"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Filter } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import AnalyticsLoading from "./loading"
import { parseAsString, useQueryState } from "nuqs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalyticsRange } from "@/types/analytics"
import { useMemo } from "react"
import AnalyticKeyMetrics from "@/components/admin/analytics/analytic-key-metrics"


export default function AnalyticsPage() {
  const [range, setRange] = useQueryState("range",parseAsString.withDefault("month"))
  const [tab, setTab] = useQueryState("tab",parseAsString.withDefault("overview"))
  const { isLoading, data } = useAnalytics(range as AnalyticsRange)
  if(isLoading) return <AnalyticsLoading/>
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <Select value={range} onValueChange={(val)=>setRange(val as AnalyticsRange)}>
            <SelectTrigger className="">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Current vs Previous Year</SelectItem>
              <SelectItem value="month">Current vs Previous Month</SelectItem>
              <SelectItem value="day">Current vs Previous Day</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {/* Key Metrics */}
      <AnalyticKeyMetrics
        range={range as AnalyticsRange}
      />
      <Tabs defaultValue={tab} value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart previous={data?.previous ?? []} current={data?.current ?? []} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best performing products this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <TopProducts topProducts={data?.topProducts ?? []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Detailed revenue breakdown and trends.</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart previous={data?.previous ?? []} current={data?.current ?? []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Analytics</CardTitle>
              <CardDescription>Order volume and trends over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersChart current={data?.current ?? []} previous={data?.previous ?? []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Customer acquisition and behavior insights.</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerAnalytics current={data?.current ?? []} previous={data?.previous ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
