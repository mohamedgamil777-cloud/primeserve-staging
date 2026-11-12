import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react"
import { getTenantId } from "@/lib/tenant"
import { db } from "@/db"
import { getSession } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import RedirectToDashboard from "@/components/common/redirect-to-dashboard"
import { formatDate } from "@/lib/date"
import { genProductImageUrl } from "@/lib/product"
import BuyAgainButton from "@/components/order/buy-again-button"
import { getTranslations } from "next-intl/server"
import { getLocalizedValue } from "@/types/internationalization"

export default async function OrderDetailsPage({params}:{"params":Promise<{"id":string,locale: string}>}) {
  const [
    {id:orderId,locale},
    storeId,
    session,
  ] =  await Promise.all([
    params,
    getTenantId(),
    getSession(),
  ])

  if(!session) redirect("/auth/login")
  if(session.user_role !== "customer") return <RedirectToDashboard role={session.user_role}/>

  const order = await db.query.orders.findFirst({
    "columns":{
      "subtotal":true,
      "totalAmount":true,
      "code":true,
      "status":true,
      "createdAt":true,
      "freeShipping":true,
      "shippingCost":true,
    },
    "with":{
      "address":true,
      "items":{
        "columns":{
          "price":true,
          "quantity":true,
          "nameI18n":true,
          "mainImage":true,
        },
      },
      "statusUpdates":true
    },
    "where":(orders,{eq,and})=>and(
      eq(orders.storeId,storeId),
      eq(orders.id,orderId),
      eq(orders.userId,session.user_id),
    )
  })

  if(!order) redirect("/account/orders")

  const t = await getTranslations({locale})

  const orderStatusDescriptions = {
    "pending":t('order-placed-by-customer'),
    "paid":t('payment-received'),
    "processing":t('order-is-being-processed'),
    "shipped": t('order-has-been-shipped'),
    "delivered":t('order-has-been-delivered'),
    "cancelled":t('order-has-been-cancelled'),
  } as const

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${locale}/account/orders`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order #{order.code}</h1>
          <p className="text-muted-foreground">{t('placed-on')} {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge
          variant={
            order.status === "processing"
              ? "default"
              : order.status === "shipped"
                ? "secondary"
                : order.status === "delivered"
                  ? "outline"
                  : "destructive"
          }
          className="text-sm px-3 py-1"
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
        <Button variant="outline" size="sm">
          {t('need-help')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('order-timeline')}</CardTitle>
          <CardDescription>{t('track-the-status-of-your-order')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-3 top-0 h-full w-px bg-border" />
            <div className="space-y-8">
              {order.statusUpdates.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                    {event.status === "pending" ? (
                      <Package className="h-3 w-3 text-primary-foreground" />
                    ) : event.status === "paid" ? (
                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                    ) : event.status === "processing" ? (
                      <Package className="h-3 w-3 text-primary-foreground" />
                    ) : event.status === "shipped" ? (
                      <Truck className="h-3 w-3 text-primary-foreground" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <div className="space-y-1 pb-8">
                    <p className="text-sm font-medium capitalize">{event.status.replace(/_/g, " ")}</p>
                    <p className="text-sm text-muted-foreground">{orderStatusDescriptions[event.status]}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('order-items')}</CardTitle>
            <CardDescription>{t('items-included-in-this-order')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item,idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={genProductImageUrl(item.mainImage)}
                      alt={getLocalizedValue(item.nameI18n,locale as "en")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{getLocalizedValue(item.nameI18n,locale as "en")}</h4>
                        {/* <p className="text-sm text-muted-foreground">Variant: {item.variant}</p> */}
                        <p className="text-sm text-muted-foreground">Variant: {t('no-variant')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">EGP {(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          EGP {item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span>EGP {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('shipping')}</span>
                  <span>{order.freeShipping ? t('free') : `EGP ${order.shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('tax')}</span>
                  {/* <span>EGP {order.tax.toFixed(2)}</span> */}
                  <span>EGP {0}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>{t('total')}</span>
                  <span>EGP {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('shipping-information')}</CardTitle>
              <CardDescription>{t('delivery-details-and-tracking')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="font-medium">{t('shipping-address')}</p>
                  <p className="text-sm">{order.address.address}</p>
                  <p className="text-sm">
                    {order.address.city}, {order.address.state} {order.address.zipCode}
                  </p>
                  <p className="text-sm">{order.address.country}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="font-medium">{t('shipping-method')}</p>
                  {/* <p className="text-sm">{order.shipping.method}</p> */}
                  <p className="text-sm">{t('standerd-shipping')}</p>
                </div>
                {/* {order.shipping.trackingNumber && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <p className="font-medium">Tracking Number</p>
                      <p className="text-sm">{order.shipping.trackingNumber}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Track Package
                      </Button>
                    </div>
                  </>
                )} */}
                  <Separator />
                  <div className="space-y-1">
                    <p className="font-medium">{t('tracking-number')}</p>
                    <p className="text-sm">{t('no-tracking-number')}</p>
                    <Button disabled variant="outline" size="sm" className="mt-2">
                      {t('track-package')}
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('payment-information')}</CardTitle>
              <CardDescription>{t('payment-method-and-billing-details')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="font-medium">{t('payment-method')}</p>
                  <p className="text-sm">
                    {/* {order.payment.method} {order.payment.cardLast4 && `(**** **** **** ${order.payment.cardLast4})`} */}
                    {t('cash-on-delivery')}
                  </p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="font-medium">{t('billing-address')}</p>
                  <p className="text-sm">{order.address.address}</p>
                  <p className="text-sm">
                    {order.address.city}, {order.address.state} {order.address.zipCode}
                  </p>
                  <p className="text-sm">{order.address.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" asChild>
          <Link href={`/${locale}/account/orders`}>{t('return-to-orders')}</Link>
        </Button>
        <BuyAgainButton orderItems={order.items as any}/>
      </div>
    </div>
  )
}
