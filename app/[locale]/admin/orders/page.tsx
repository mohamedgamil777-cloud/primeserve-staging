"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, Search } from "lucide-react"
import Link from "next/link"
import { useOrders } from "@/hooks/use-orders"
import { useState } from "react"
import { OrderSort, OrderStatus } from "@/types/order"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import InfiniteScrollTable from "@/components/common/infinite-scroll-table"
import { formatDate } from "@/lib/date"
import { useLocale } from "next-intl"

export default function OrdersPage() {
  const locale = useLocale()
  const [sortBy, setSortBy] = useState<OrderSort>("newest")
  const [status, setStatus] = useState<OrderStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebouncedValue(searchQuery,1000)
  
  const query = useOrders({
    query:debouncedQuery,
    status,sort:sortBy,
  })
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            type="search" 
            placeholder="Search orders..." 
            className="w-full pl-8" 
          />
        </div>
        <Select value={status} onValueChange={(newStatus)=>setStatus(newStatus as OrderStatus)} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(newVal)=>setSortBy(newVal as OrderSort)} defaultValue="newest">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest">Highest Total</SelectItem>
            <SelectItem value="lowest">Lowest Total</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <InfiniteScrollTable
          query={query}
          cols={[
            {
              "order":1,
              "head":"Order ID",
              "cell":(allOrders,order)=>(`#${order.code}`),
              "cellClassName":()=>"font-medium text-left"
            },
            {
              "order":2,
              "head":"Customer",
              "cellClassName":()=>"text-left",
              "cell":(allOrders,order)=>(`${order.user?.firstName} ${order.user?.lastName}`),
            },
            {
              "order":3,
              "head":"Date",
              "cellClassName":()=>"text-left",
              "cell":(allOrders,order)=>formatDate(order.createdAt),
            },
            {
              "order":4,
              "head":"Items",
              "cellClassName":()=>"text-left",
              "cell":(allOrders,order)=>order.productsCount.toLocaleString(),
            },
            {
              "order":5,
              "head":"Total",
              "cellClassName":()=>"text-left",
              "cell":(allOrders,order)=>order.totalAmount.toLocaleString(),
            },
            {
              "order":6,
              "head":"Status",
              "cellClassName":()=>"text-left",
              "cell":(allOrders,order)=>(
                <Badge
                  variant={
                    order.status === "pending"
                      ? "default"
                      : order.status === "shipped"
                        ? "secondary"
                        : (order.status === "delivered" || order.status === "paid")
                          ? "outline"
                          : "destructive"
                  }
                >
                  {order.status}
                </Badge>
              ),
            },
            {
              "order":7,
              "head":"Actions",
              "headClassName":"text-right",
              "cell":(allOrders,order)=>(
                <Link href={`/${locale}/admin/orders/${order.id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </Link>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
