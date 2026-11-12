"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCustomers } from "@/hooks/use-customers"
import { useEffect, useMemo } from "react"
import { formatDate } from "@/lib/date"
import { startOfMonth, endOfMonth } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportButton } from "@/components/common/export-button"


type CustomerReportItem = {
  id: string,
  name: string,
  img?: string|null,
  email: string,
  orders: string,
  totalSpent: string,
  lastOrder: string,
}

export function CustomerReport() {
  const customersQuery = useCustomers({})
  
  useEffect(()=>{
    if(customersQuery.hasNextPage && !customersQuery.isFetchingNextPage) customersQuery.fetchNextPage()
  },[customersQuery.hasNextPage,customersQuery.isFetchingNextPage])

  const customerStats = useMemo(()=>{
    const flatCustomers = customersQuery.data?.pages.flatMap(pg=>pg).flatMap(item=>item) ?? []
    const totalCustomers = flatCustomers.length
    const newCustomers = flatCustomers
      .filter(customer=>formatDate(customer.createdAt) > formatDate(startOfMonth(new Date)) && formatDate(customer.createdAt) < formatDate(endOfMonth(new Date())))
      .length
    return {
      totalCustomers,
      newCustomers,
    }
  },[customersQuery])

  const customersData = useMemo(()=>{
    const data:CustomerReportItem[] = []
    const flatCustomers = customersQuery.data?.pages.flatMap(pg=>pg).flatMap(item=>item) ?? []
    for(const customer of flatCustomers){
      data.push({
        "id":customer.id!,
        "img":customer.img,
        "email":customer.email,
        "name":`${customer.firstName} ${customer.lastName}`,
        "orders":customer.orders.toLocaleString(),
        "totalSpent":customer.spent.toLocaleString(),
        "lastOrder":customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "---"
      })
    }
    
    return data
  },[customersQuery])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Customer Report</CardTitle>
            <CardDescription>Customer demographics, behavior, and segmentation analysis.</CardDescription>
          </div>
          <div className="flex space-x-2">
            <ExportButton
              data={customersData}
              filename="customers-report"
              format="csv"
            />
            <ExportButton
              data={customersData}
              filename="customers-report"
              format="excel"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Customers</p>
              <p className="text-2xl font-bold">{customerStats.totalCustomers.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">New This Month</p>
              <p className="text-2xl font-bold">{customerStats.newCustomers.toLocaleString()}</p>
            </div>
            {/* <div className="space-y-2">
              <p className="text-sm font-medium">Average CLV</p>
              <p className="text-2xl font-bold">$1,456</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Retention Rate</p>
              <p className="text-2xl font-bold">68%</p>
            </div> */}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                {/* <TableHead>Segment</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/api/imgs/users/${customer.img}`} alt={customer.name} />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  {/* <TableCell>
                    <Badge
                      variant={
                        customer.segment === "VIP" ? "default" : customer.segment === "Regular" ? "secondary" : "outline"
                      }
                    >
                      {customer.segment}
                    </Badge>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    
  )
}
