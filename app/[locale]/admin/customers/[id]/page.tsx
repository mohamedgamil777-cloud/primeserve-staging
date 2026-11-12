import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, CreditCard, Edit, Mail, MapPin, Phone, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { getSession } from "@/lib/auth-server"
import { getTenantId } from "@/lib/tenant"
import { db } from "@/db"
import CustomerOrderHistory from "@/components/admin/customer/customer-order-history"
import CustomerNotes from "@/components/admin/customer/customer-notes"
import CustomerWishlist from "@/components/admin/customer/customer-wishlist"
import CustomerActivityLogs from "@/components/admin/customer/customer-activity-logs"
import { addresses, orders, users } from "@/db/schema"
import { sql } from "drizzle-orm"
import CustomerPaymentMethods from "@/components/admin/customer/customer-payment-methods"

export default async function CustomerProfile({params}:{"params":Promise<{"id":string,locale:string}>}) {
  const [
    { id:customerId, locale },
    session,
    storeId
  ] = await Promise.all([
    params,
    getSession(),
    getTenantId(),
  ])

  if(!session || session.user_role !=="seller" || !session.stores.includes(storeId)) redirect("/auth/login")

  const customer = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      createdAt: users.createdAt,
      customerNotes: users.customerNotes,
      orderCount: sql<number>`COUNT(${orders.id})`.as("orderCount"),
      totalSpent: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`.as("totalSpent"),
      addressId: addresses.id,
      address: addresses.address,
      country: addresses.country,
      city: addresses.city,
      state: addresses.state,
      zipCode: addresses.zipCode,
    })
    .from(users)
    .leftJoin(orders, sql`${orders.userId} = ${users.id} AND ${orders.storeId} = ${users.storeId}`)
    .leftJoin(addresses, sql`${addresses.userId} = ${users.id}`)
    .where(sql`${users.id} = ${customerId} AND ${users.storeId} = ${storeId}`)
    .groupBy(users.id,addresses.id)
    .limit(1)
    .then((res) => res[0])

  if(!customer) redirect("/admin/customers")

  //Default to active for now
  const customerStatus = "active"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/${locale}/admin/customers`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>
            <p className="text-muted-foreground">View and manage customer information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`mailto:${customer.email}`}>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email Customer
            </Button>
          </Link>
          {
            !!customer.phone
            &&
            <Link href={`tel:${customer.phone}`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Call Customer
              </Button>
            </Link>
          }
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Customer Information</CardTitle>
            <Badge variant={customerStatus === "active" ? "default" : "secondary"} className="capitalize">
              {customerStatus}
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center space-y-3 pb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={"/placeholder.png"} alt={customer.firstName} />
                <AvatarFallback>{customer.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-medium">{customer.firstName} {customer.lastName}</h3>
                {/* <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p> */}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{customer.phone ?? "Not Provided"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{customer.orderCount.toLocaleString()} orders</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Total spent: ${customer.totalSpent.toLocaleString()}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                Shipping Address
              </h4>
              <div className="text-sm">
                <p>{customer.address}</p>
                <p>
                  {customer.city}, {customer.state} {customer.zipCode}
                </p>
                <p>{customer.country}</p>
              </div>
            </div>

            <Separator className="my-4" />
            <CustomerPaymentMethods customerId={customer.id}/>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <CustomerNotes customerNotes={customer.customerNotes} customerId={customer.id}/>
          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="space-y-4">
              <CustomerOrderHistory customerId={customer.id}/>
            </TabsContent>
            <TabsContent value="wishlist" className="space-y-4">
              <CustomerWishlist customerId={customer.id}/>
            </TabsContent>
            <TabsContent value="activity" className="space-y-4">
              <CustomerActivityLogs customerId={customer.id}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
