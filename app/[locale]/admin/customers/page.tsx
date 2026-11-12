"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CustomerSort, CustomerStatus } from "@/types/customer"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useCustomers } from "@/hooks/use-customers"
import InfiniteScrollTable from "@/components/common/infinite-scroll-table"
import { formatDate } from "@/lib/date"
import { useLocale } from "next-intl"

export default function CustomersPage() {
  const locale = useLocale()
  const [sortBy, setSortBy] = useState<CustomerSort>("newest")
  const [status, setStatus] = useState<CustomerStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebouncedValue(searchQuery,1000)
  
  const query = useCustomers({
    query:debouncedQuery,
    status,sort:sortBy,
  })
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">View and manage your customer base.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} type="search" placeholder="Search customers..." className="w-full pl-8" />
        </div>
        <Select value={status} onValueChange={val=>setStatus(val as CustomerStatus)} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={val=>setSortBy(val as CustomerSort)} defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="most-orders">Most Orders</SelectItem>
            <SelectItem value="last-order">Last Order Date</SelectItem>
            <SelectItem value="highest-spent">Highest Spent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <InfiniteScrollTable
          query={query}
          cols={[
            {
              "order":1,
              "head":"Customer",
              "cell":(allCustomers,customer)=>(
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={"/placeholder.png"} alt={customer.firstName} />
                    <AvatarFallback>{customer.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{customer.firstName} {customer.lastName}</span>
                </div>
              ),
              "cellClassName":()=>"font-medium text-left"
            },
            {
              "order":2,
              "head":"Email",
              "cellClassName":()=>"text-left",
              "cell":(allCustomers,customer)=>(customer.email),
            },
            {
              "order":3,
              "head":"Orders",
              "cellClassName":()=>"text-left",
              "cell":(allCustomers,customer)=>customer.orders.toLocaleString(),
            },
            {
              "order":4,
              "head":"Total Spent",
              "cellClassName":()=>"text-left",
              "cell":(allCustomers,customer)=>`EGP ${customer.spent.toLocaleString()}`,
            },
            {
              "order":5,
              "head":"Status",
              "cellClassName":()=>"text-left",
              "cell":(allCustomers,customer)=>(
                <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
              ),
            },
            {
              "order":6,
              "head":"Joined",
              "cellClassName":()=>"text-left",
              "cell":(allCustomers,customer)=>(
                formatDate(customer.createdAt)
              ),
            },
            {
              "order":7,
              "head":"Last Order",
              "cellClassName":()=>"text-left",
              "cell":(allCustomers,customer)=>(
                customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "---"
              ),
            },
            {
              "order":8,
              "head":"Actions",
              "headClassName":"text-right",
              "cell":(allCustomers,customer)=>(
                <Link href={`/${locale}/admin/customers/${customer.id}`}>
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
