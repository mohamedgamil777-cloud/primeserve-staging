"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  Download,
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Heart,
  Wrench,
  ShoppingCart,
  Star,
  Clock,
  Target,
  Filter,
} from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { AnalyticsRange } from "@/types/analytics"
import { useCustomerAnalytics } from "@/hooks/use-customer-analytics"
import AccountReportsLoading from "./loading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trend } from "@/components/admin/analytics/analytic-key-metrics"
import { formatDate } from "@/lib/date"
import { OrderStatus } from "@/types/order"
import { ServiceRequestStatus } from "@/types/services"
import { useTranslations } from "next-intl"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"

const getStatusBadgeClassName = (status:OrderStatus|ServiceRequestStatus)=>{
  switch(status){
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    case "completed":
    case "delivered":
      return "bg-green-100 text-green-800"
    case "processing":
    case "paid":
    case "shipped":
    case "all":
    case "confirmed":
    case "assigned":
    case "in-progress":
      return "bg-blue-100 text-blue-800"
  }
}

export default function AccountReportsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [range, setRange] = useQueryState("range",parseAsString.withDefault("month"))
  const [tab, setTab] = useQueryState("tab",parseAsString.withDefault("spending"))
  const { isLoading, data } = useCustomerAnalytics(range as AnalyticsRange)
  if(isLoading) return <AccountReportsLoading/>
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('reports-and-analytics')}</h1>
          <p className="text-muted-foreground">{t('track-your-spending-orders-and-service-history')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={(val)=>setRange(val as AnalyticsRange)}>
            <SelectTrigger className="">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t('range')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">{t('current-vs-previous-year')}</SelectItem>
              <SelectItem value="month">{t('current-vs-previous-month')}</SelectItem>
              <SelectItem value="day">{t('current-vs-previous-day')}</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            {t("ui.export")}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("ui.totalSpent")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">EGP {data?.totals.current.totalSpent.toLocaleString()}</div>
            <Trend
              cur={data?.totals.current.totalSpent ?? 0}
              prev={data?.totals.previous.totalSpent ?? 0}
              period={range}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total-orders')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data?.totals.current.totalOrders ?? 0).toLocaleString()}</div>
            <Trend
              cur={data?.totals.current.totalOrders ?? 0}
              prev={data?.totals.previous.totalOrders ?? 0}
              period={range}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('services-used')}</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data?.totals.current.servicesUsed ?? 0).toLocaleString()}</div>
            <Trend
              cur={data?.totals.current.servicesUsed ?? 0}
              prev={data?.totals.previous.servicesUsed ?? 0}
              period={range}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avg-order-value')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">EGP {(data?.totals.current.avgOrderValue ?? 0).toLocaleString()}</div>
            <Trend
              cur={data?.totals.current.avgOrderValue ?? 0}
              prev={data?.totals.previous.avgOrderValue ?? 0}
              period={range}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={tab} value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spending">{t('spending')}</TabsTrigger>
          <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
          <TabsTrigger value="services">{t('services')}</TabsTrigger>
          <TabsTrigger disabled value="insights">{t('insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current {range} Spending</CardTitle>
                <CardDescription>{t('your-spending-pattern-over-the-current')} {range}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data?.spendingData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`EGP ${value}`, "Amount"]} />
                    <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('spending-by-category')}</CardTitle>
                <CardDescription>{t('breakdown-of-your-purchases-by-category')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data?.categoryData ? [...data?.categoryData,{
                        name: "Services",
                        value: data.totals.current.servicesUsed ?? 0,
                        color: "#f3f3f3"
                      }] : []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data?.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('top-purchases')}</CardTitle>
              <CardDescription>{t('your-highest-value-purchases-this-period')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {
                  data?.topProducts.map(product=>(
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{getLocalizedValue(product.nameI18n,locale)}</p>
                          <p className="text-sm text-muted-foreground">count: {Math.floor(product.totalSpent/Math.max(product.price,1))}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{t("price")}: EGP {product.price.toLocaleString()}</p>
                        <Badge variant="secondary">{t("spent")}: EGP {product.totalSpent.toLocaleString()}</Badge>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('order-frequency')}</CardTitle>
                <CardDescription>{t('number-of-orders-placed-each-month')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.orderTrendData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('order-status-distribution')}</CardTitle>
                <CardDescription>{t('current-status-of-your-orders')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {
                    data?.ordersByStatus.map(stat=>(
                      <div key={stat.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-3 w-3 rounded-full bg-green-500",stat.status === "pending" ? "bg-yellow-500" : stat.status === "delivered" ? "bg-green-500" : stat.status === "cancelled" ? "bg-red-500" : "bg-blue-500")} />
                          <span>{stat.status}</span>
                        </div>
                        <span className="font-medium">{stat.count} orders</span>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('recent-orders')}</CardTitle>
              <CardDescription>{t('your-most-recent-order-activity')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {
                  data?.lastOrders.map(order=>(
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Order #{order.code} ({order.itemCount} items)</p>
                          <p className="text-sm text-muted-foreground">{order.date ? formatDate(order.date) : ""}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={cn(getStatusBadgeClassName(order.status as OrderStatus))}>{order.status}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">EGP {order.totalAmount}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('service-usage')}</CardTitle>
                <CardDescription>{t('services-requested-over-time')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data?.serviceTrendData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="services" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('service-categories')}</CardTitle>
                <CardDescription>{t('types-of-services-youve-used')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {
                    data?.serviceRequestsByCategory.map((cat,idx)=>(
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          <span>{getLocalizedValue(cat.category,locale)}</span>
                        </div>
                        <span className="font-medium">{cat.count} services</span>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('service-history')}</CardTitle>
              <CardDescription>{t('your-recent-service-requests')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {
                  data?.lastServiceRequests.map(req=>(
                    <div key={req.id} className="flex items-center justify-between">  
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Wrench className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{getLocalizedValue(req.service,locale)}</p>
                          <p className="text-sm text-muted-foreground">{req.date ? formatDate(req.date) : ""}</p>
                        </div>
                      </div>  
                      <div className="text-right">
                        <Badge 
                          className={cn(getStatusBadgeClassName(req.status as ServiceRequestStatus))}
                        >
                          {req.status}
                        </Badge>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('spending-insights')}</CardTitle>
                <CardDescription>{t('personalized-insights-about-your-spending')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t('peak-spending-month')}</p>
                    <p className="text-sm text-muted-foreground">
                      You spent the most in May ($423). This was mainly due to your TV purchase.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t('budget-performance')}</p>
                    <p className="text-sm text-muted-foreground">
                      You're 15% under your monthly budget of $350. Great job staying on track!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t('favorite-category')}</p>
                    <p className="text-sm text-muted-foreground">
                      Electronics make up 45% of your purchases. You love tech!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('recommendations')}</CardTitle>
                <CardDescription>{t('suggestions-based-on-your-activity')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t('service-reminder')}</p>
                    <p className="text-sm text-muted-foreground">
                      Your TV was installed 6 months ago. Consider a maintenance check.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t('accessory-suggestion')}</p>
                    <p className="text-sm text-muted-foreground">
                      Based on your iPhone purchase, you might like our premium cases.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t('savings-opportunity')}</p>
                    <p className="text-sm text-muted-foreground">
                      Bundle your next purchase with installation to save 15%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('loyalty-status')}</CardTitle>
              <CardDescription>{t('your-membership-benefits-and-progress')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('current-tier')}</p>
                    <p className="text-sm text-muted-foreground">{t('gold-member')}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">{t("ui.gold")}</Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{t("ui.progressPlatinum")}</span>
                    <span className="text-sm text-muted-foreground">EGP 311 / EGP 500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">1,250</p>
                    <p className="text-sm text-muted-foreground">{t("ui.pointsEarned")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">15%</p>
                    <p className="text-sm text-muted-foreground">{t("ui.discountRate")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
