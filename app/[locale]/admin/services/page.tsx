"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useServices } from "@/hooks/use-services"
import { useServiceCategories } from "@/hooks/use-service-categories"
import InfiniteScrollTable from "@/components/common/infinite-scroll-table"
import { AdminEmptyServices } from "@/components/admin/services/admin-empty-services"
import ServiceRowActions from "@/components/admin/services/service-row-actions"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"


export default function AdminServicesPage() {
  const locale = useLocale()
  const router = useRouter()
  const [q, setQ] = useQueryState("q",parseAsString.withDefault(""))
  const [category, setCategory] = useQueryState("category",parseAsString.withDefault("all"))
  const [type, setType] = useQueryState("type",parseAsString.withDefault("all"))
  const debouncedQuery = useDebouncedValue(q,1000)

  const query = useServices({
    "query":debouncedQuery ?? undefined,
    "categoryId":category === "all" ? undefined : category,
    "type":type === "all" ? undefined : type
  })

  const { data:categories } = useServiceCategories()


  // const [searchTerm, setSearchTerm] = useState("")
  // const [categoryFilter, setCategoryFilter] = useState("all")
  // const [typeFilter, setTypeFilter] = useState("all")

  // const filteredServices = services.filter((service) => {
  //   const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
  //   const matchesType = typeFilter === "all" || service.type === typeFilter
  //   return matchesSearch && matchesCategory && matchesType
  // })

  // const totalRevenue = services.reduce((sum, service) => sum + service.revenue, 0)
  // const totalBookings = services.reduce((sum, service) => sum + service.bookings, 0)
  // const activeServices = services.filter((service) => service.isActive).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Manage your service offerings and pricing</p>
        </div>
        <Button onClick={() => router.push("/admin/services/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">{activeServices} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>Manage your service catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {
                  categories?.map(category=>(
                    <SelectItem key={category.id} value={category.id}>{getLocalizedValue(category.nameI18n,locale)}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Installation">Installation</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Services Table */}
          <div className="rounded-md border">
            <InfiniteScrollTable
              query={query}
              cols={[
                {
                  "order":1,
                  "cellClassName":()=>"text-left font-medium",
                  "head":"Service",
                  "cell":(allServices,service)=>(
                    getLocalizedValue(service.nameI18n,locale)
                  )
                },
                {
                  "order":2,
                  "head":"Category",
                  "cellClassName":()=>"text-left",
                  "cell":(allServices,service)=>(
                    <Badge variant="outline">{getLocalizedValue(service.category.nameI18n,locale)}</Badge>
                  )
                },
                {
                  "order":3,
                  "head":"Type",
                  "cellClassName":()=>"text-left",
                  "cell":(allServices,service)=>(
                    <Badge variant="secondary">{service.type}</Badge>
                  )
                },
                {
                  "order":4,
                  "head":"Pricing",
                  "cellClassName":()=>"text-left",
                  "cell":(allServices,service)=>(
                    service.pricingModel === "fixed" ? (
                        <span className="font-semibold">${service.price}</span>
                      ) : (
                        <Badge>Quote Required</Badge>
                      )
                  )
                },
                {
                  "order":5,
                  "head":"Duration",
                  "cell":(allServices,service)=>(
                    service.estimatedDuration
                  ),
                  "cellClassName":()=>"text-left",
                },
                // {
                //   "order":4,
                //   "head":"Bookings",
                //   "cell":(allServices,service)=>(
                //     service.bookings?.toLocaleString()
                //   ),
                //   "cellClassName":()=>"text-left",
                // },
                {
                  "order":6,
                  "head":"Rating",
                  "cell":(allServices,service)=>(
                    <div className="flex items-center gap-1">
                      <span>{service.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  ),
                  "cellClassName":()=>"text-left",
                },
                {
                  "order":5,
                  "head":"Status",
                  "cell":(allServices,service)=>(
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  ),
                  "cellClassName":()=>"text-left",
                },
                {
                  "order":6,
                  "head":"Actions",
                  "cellClassName":()=>"text-right",
                  "headClassName":"text-right",
                  "cell":(allServices,service)=>(
                    <ServiceRowActions service={service}/>
                  )
                },
              ]}
              emptyStateComponent={<AdminEmptyServices/>}
            />            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
