"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Percent, ShoppingCart, Tag, Users } from "lucide-react"

type Props = {
  totalPromotions:number,
  activePromotions:number,
  totalRedemptions:number,
  uniqueCustomers:number
}

export function PromotionStats({totalPromotions,activePromotions,totalRedemptions,uniqueCustomers}:Props) {
  const stats = [
    {
      title: "Total Promotions",
      value: totalPromotions.toLocaleString(),
      icon: Tag,
      change: "+2",
      trend: "up",
    },
    {
      title: "Active Promotions",
      value: activePromotions.toLocaleString(),
      icon: Percent,
      change: "+3",
      trend: "up",
    },
    {
      title: "Total Redemptions",
      value: totalRedemptions.toLocaleString(),
      icon: ShoppingCart,
      change: "+8%",
      trend: "up",
    },
    {
      title: "Unique Customers",
      value: uniqueCustomers.toLocaleString(),
      icon: Users,
      change: "-2%",
      trend: "down",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.trend === "up" ? (
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}>{stat.change}</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
