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
        <h1 className="text-3xl font-bold tracking-tight">Account Overview</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{userInfo?.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{userInfo?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{userInfo?.phone ?? "Not Provided"}</p>
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
            <CardTitle className="text-lg">Account Summary</CardTitle>
            <CardDescription>Your account activity at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(userInfo?.createdAt!)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <Badge variant="outline">Active</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-medium">{ordersCount?.count ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wishlist Items</p>
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
              <CardTitle className="text-lg">Orders</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Track, view, and manage your order history.</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href={`/${locale}/account/orders`}>View Orders</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Wishlist</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Save items for later and keep track of products you love.</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href={`/${locale}/account/wishlist`}>View Wishlist</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Manage your email preferences and notification settings.</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href={`/${locale}/account/notifications`}>Manage Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
