"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useOrders } from "@/hooks/use-orders"


export function AdminRecentOrders() {
  const ordersQuery = useOrders({})
  const recentOrders = ordersQuery.data?.pages.at(0)?.flatMap(item=>item).slice(0,7) ?? []
  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={"/placeholder.png"} alt={order.user?.firstName} />
              <AvatarFallback>{order.user?.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{`${order.user?.firstName} ${order.user?.lastName}`}</p>
              <p className="text-sm text-muted-foreground">#{order.code}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
            >
              {order.status}
            </Badge>
            <p className="text-sm font-medium">EGP {order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
