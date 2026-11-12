import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Package, Heart, Bell, Settings } from "lucide-react"
import CustomerOverviewTabs from "@/components/account/customer-overview-tabs"
import { getSession } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { formatDate } from "@/lib/date"
import { count, eq } from "drizzle-orm"
import { orders, wishlists } from "@/db/schema"
import RedirectToDashboard from "@/components/common/redirect-to-dashboard"

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const tu = await getTranslations({ locale: (await params).locale, namespace: "ui" })
  const [session,{locale}] = await Promise.all([
    getSession(),
    params
  ]) 
  if(!session) redirect("/auth/login")
  if(session.user_role !== "customer") return <RedirectToDashboard role={session.user_role}/>
  const [
    userInfo,
    [ordersCount],
    [wishlistItemsCount],
  ] = await Promise.all([
    db.query.users.findFirst({
      "where":(users,{eq})=>eq(users.id,session.user_id),
      "columns":{
        "firstName":true,
        "lastName":true,
        "email":true,
        "phone":true,
        "createdAt":true,
      }
    }),
    db.select({"count":count()}).from(orders).where(eq(orders.userId,session.user_id)),
    db.select({"count":count()}).from(wishlists).where(eq(wishlists.userId,session.user_id)),
  ])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{tu("accountOverview")}</h1>
        <p className="text-muted-foreground">{tu("manageAccount")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{tu("personalInfo")}</CardTitle>
            <CardDescription>{tu("managePersonal")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{tu("firstName")}</p>
                <p className="font-medium">{userInfo?.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{tu("lastName")}</p>
                <p className="font-medium">{userInfo?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{tu("email")}</p>
                <p className="font-medium">{userInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{tu("phone")}</p>
                <p className="font-medium">{userInfo?.phone ?? tu("notProvided")}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/account/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Edit Information
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{tu("accountSummary")}</CardTitle>
            <CardDescription>{tu("activityGlance")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{tu("memberSince")}</p>
                <p className="font-medium">{formatDate(userInfo?.createdAt!)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{tu("accountStatus")}</p>
                <Badge variant="outline">{tu("active")}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{tu("totalOrders")}</p>
                <p className="font-medium">{ordersCount?.count ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{tu("wishlistItems")}</p>
                <p className="font-medium">{wishlistItemsCount?.count ?? 0}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/account/orders`}>
                <Package className="mr-2 h-4 w-4" />
                View Order History
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <CustomerOverviewTabs/>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{tu("orders")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{tu("ordersText")}</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href={`/${locale}/account/orders`}>{tu("viewOrders")}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{tu("wishlist")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{tu("wishlistText")}</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href={`/${locale}/account/wishlist`}>{tu("viewWishlist")}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{tu("notifications")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{tu("notificationsText")}</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href={`/${locale}/account/notifications`}>{tu("manageNotifications")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
