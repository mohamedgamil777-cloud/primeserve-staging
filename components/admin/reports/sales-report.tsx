"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useOrders } from "@/hooks/use-orders"
import { useEffect, useMemo, useState } from "react"
import { formatDate } from "@/lib/date"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportButton } from "@/components/common/export-button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type SalesReportItem =   {
  id: string,
  customer: string,
  product: string,
  amount: string,
  quantity: string,
  status: string,
  date: string,
}

export function SalesReport() {
  const [date, setDate] = useState<Date|undefined>(new Date())
  const ordersQuery = useOrders({
    day:formatDate(date ?? new Date())
  })
  
  useEffect(()=>{
    if(ordersQuery.hasNextPage && !ordersQuery.isFetchingNextPage) ordersQuery.fetchNextPage()
  },[ordersQuery.hasNextPage,ordersQuery.isFetchingNextPage])

  const salesStats = useMemo(()=>{
    const flatOrders = ordersQuery.data?.pages.flatMap(pg=>pg).flatMap(item=>item) ?? []
    const totalSales = flatOrders.reduce((acc,cur)=>acc + cur["totalAmount"],0)
    const totalOrders = flatOrders.length
    return {
      totalSales,
      totalOrders,
      "averageOrderValue":(totalSales / Math.max(totalOrders,1)).toLocaleString(),
    }
  },[ordersQuery])

  const salesData = useMemo(()=>{
    const data:SalesReportItem[] = []
    const flatOrders = ordersQuery.data?.pages.flatMap(pg=>pg).flatMap(item=>item) ?? []
    for(const order of flatOrders){
      for(const product of (order.items ?? [])){
        data.push({
          "amount":product.price.toLocaleString(),
          "quantity":product.quantity.toLocaleString(),
          "id":order.code,
          "status":order.status,
          "customer":`${order.user?.firstName} ${order.user?.lastName}`,
          "date":formatDate(order.createdAt),
          "product":product.product?.name ?? ""
        })
      }
    }
    
    return data
  },[ordersQuery])
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>Comprehensive sales analysis and performance metrics.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* <ExportButton
              filename="sales-report"
              format="pdf"
              data={salesData}
            /> */}
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <ExportButton
              filename="sales-report"
              format="csv"
              data={salesData}
            />
            <ExportButton
              filename="sales-report"
              format="excel"
              data={salesData}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Sales</p>
              <p className="text-2xl font-bold">${salesStats.totalSales.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Orders</p>
              <p className="text-2xl font-bold">{salesStats.totalOrders.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Order Value</p>
              <p className="text-2xl font-bold">${salesStats.averageOrderValue}</p>
            </div>
            {/* <div className="space-y-2">
              <p className="text-sm font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold">3.2%</p>
            </div> */}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Unit price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>{sale.amount}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sale.status === "Completed" ? "default" : sale.status === "Pending" ? "secondary" : "destructive"
                      }
                    >
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
