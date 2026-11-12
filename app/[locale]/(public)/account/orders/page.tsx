"use client"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import CustomerOrdersTab from "@/components/order/customer-orders-tab"
import { useState } from "react"
import { OrderSort, OrderStatus } from "@/types/order"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useTranslations } from "next-intl"


export default function OrdersPage() {
  const t = useTranslations()
  const [sortBy, setSortBy] = useState<OrderSort>("newest")
  const [status, setStatus] = useState<OrderStatus>("all")
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query,1000)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('order-history')}</h1>
        <p className="text-muted-foreground">{t('view-and-manage-your-orders')}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e)=>setQuery(e.target.value)} type="search" placeholder={t('search-orders')} className="w-full pl-8" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={status} onValueChange={(newStatus)=>setStatus(newStatus as OrderStatus)} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('filter-by-status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all-orders')}</SelectItem>
              <SelectItem value="pending">{t('processing')}</SelectItem>
              <SelectItem value="shipped">{t('shipped')}</SelectItem>
              <SelectItem value="delivered">{t('delivered')}</SelectItem>
              <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(newVal)=>setSortBy(newVal as OrderSort)} defaultValue="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('sort-by')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('newest-first')}</SelectItem>
              <SelectItem value="oldest">{t('oldest-first')}</SelectItem>
              <SelectItem value="highest">{t('highest-total')}</SelectItem>
              <SelectItem value="lowest">{t('lowest-total')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={status} onValueChange={(newTab)=>setStatus(newTab as OrderStatus)} defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('all-orders')}</TabsTrigger>
          <TabsTrigger value="pending">{t('processing')}</TabsTrigger>
          <TabsTrigger value="shipped">{t('out-for-delivery')}</TabsTrigger>
          <TabsTrigger value="delivered">{t('delivered')}</TabsTrigger>
          <TabsTrigger value="cancelled">{t('cancelled')}</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <CustomerOrdersTab
            title={t('all-orders')}
            description={t('view-your-complete-order-history')}
            status="all"
            sort={sortBy}
            q={debouncedQuery ?? undefined}
          />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <CustomerOrdersTab
            title={t('processing-orders')}
            description={t('orders-that-are-currently-being-processed')}
            status="pending"
            sort={sortBy}
            q={debouncedQuery ?? undefined}
          />
        </TabsContent>
        <TabsContent value="shipped" className="space-y-4">
          <CustomerOrdersTab
            title={t('shipped-orders')}
            description={t('orders-that-are-out-for-delivery')}
            status="shipped"
            sort={sortBy}
            q={debouncedQuery ?? undefined}
          />
        </TabsContent>
        <TabsContent value="delivered" className="space-y-4">
          <CustomerOrdersTab
            title={t('delivered-orders')}
            description={t('orders-that-have-been-delivered')}
            status="delivered"
            sort={sortBy}
            q={debouncedQuery ?? undefined}
          />
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-4">
          <CustomerOrdersTab
            title={t('cancelled-orders')}
            description={t('orders-that-have-been-cancelled')}
            status="cancelled"
            sort={sortBy}
            q={debouncedQuery ?? undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
