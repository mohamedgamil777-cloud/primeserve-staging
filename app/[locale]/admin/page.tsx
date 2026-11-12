"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders"
import { AdminRecentSales } from "@/components/admin/admin-recent-sales"
import AnalyticKeyMetrics from "@/components/admin/analytics/analytic-key-metrics"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance and recent activity.</p>
      </div>

      <AnalyticKeyMetrics
        range={"month"}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>The Trend of your sales in the current year.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AdminRecentSales />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Take a peek on your recent orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRecentOrders />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
