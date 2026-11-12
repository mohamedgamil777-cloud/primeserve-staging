"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, CreditCard, Download, MapPin, Package, Send, Truck, User } from "lucide-react"
import Link from "next/link"
import { useLocale } from "next-intl"

// Mock order data
const mockOrder = {
  id: "ORD-001",
  date: "2023-05-14T10:30:00Z",
  status: "processing",
  customer: {
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.png?height=40&width=40",
  },
  items: [
    {
      id: "1",
      name: "Classic White T-Shirt",
      price: 29.99,
      quantity: 2,
      image: "/placeholder.png?height=80&width=80",
      variant: "Medium",
    },
    {
      id: "4",
      name: "Leather Crossbody Bag",
      price: 79.99,
      quantity: 1,
      image: "/placeholder.png?height=80&width=80",
      variant: "Brown",
    },
  ],
  shipping: {
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    method: "Standard Shipping",
    trackingNumber: "TRK12345678",
  },
  payment: {
    method: "Credit Card",
    cardLast4: "4242",
    status: "paid",
    total: 139.97,
    subtotal: 139.97,
    shipping: 0,
    tax: 0,
  },
  notes: "",
  timeline: [
    {
      status: "order_placed",
      date: "2023-05-14T10:30:00Z",
      description: "Order placed by customer",
    },
    {
      status: "payment_received",
      date: "2023-05-14T10:32:00Z",
      description: "Payment received",
    },
    {
      status: "processing",
      date: "2023-05-14T14:45:00Z",
      description: "Order is being processed",
    },
  ],
}

export default function OrderDetails() {
  const locale = useLocale()
  const [orderStatus, setOrderStatus] = useState(mockOrder.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [notes, setNotes] = useState(mockOrder.notes)

  const handleStatusChange = (newStatus: string) => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setOrderStatus(newStatus)
      setIsUpdating(false)

      // Add to timeline
      const statusMap: Record<string, string> = {
        processing: "Order is being processed",
        shipped: "Order has been shipped",
        delivered: "Order has been delivered",
        cancelled: "Order has been cancelled",
      }
    }, 1000)
  }

  const handleSaveNotes = () => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      // In a real app, this would save the notes to the backend
    }, 1000)
  }

  // Calculate totals
  const subtotal = mockOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/${locale}/admin/orders`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order {mockOrder.id}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(mockOrder.date).toLocaleDateString()} at{" "}
              {new Date(mockOrder.date).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Email Customer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in this order</CardDescription>
            </div>
            <Badge
              variant={
                orderStatus === "processing"
                  ? "default"
                  : orderStatus === "shipped"
                    ? "secondary"
                    : orderStatus === "delivered"
                      ? "outline"
                      : "destructive"
              }
              className="capitalize"
            >
              {orderStatus}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Variant: {item.variant}</p>
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
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>EGP {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{mockOrder.payment.shipping === 0 ? "Free" : `EGP ${mockOrder.payment.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>EGP {mockOrder.payment.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>EGP {mockOrder.payment.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={mockOrder.customer.avatar || "/placeholder.png"} alt={mockOrder.customer.name} />
                  <AvatarFallback>{mockOrder.customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{mockOrder.customer.name}</h4>
                  <p className="text-sm text-muted-foreground">{mockOrder.customer.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={orderStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger className=" w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {orderStatus === "shipped" && (
                <div className="mt-4">
                  <label className="text-sm font-medium">Tracking Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={mockOrder.shipping.trackingNumber} />
                    <Button size="sm">Update</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{mockOrder.customer.name}</p>
                  <p>{mockOrder.shipping.address}</p>
                  <p>
                    {mockOrder.shipping.city}, {mockOrder.shipping.state} {mockOrder.shipping.zipCode}
                  </p>
                  <p>{mockOrder.shipping.country}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span>{mockOrder.shipping.method}</span>
                  </div>
                  {mockOrder.shipping.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking</span>
                      <span>{mockOrder.shipping.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span>{mockOrder.payment.method}</span>
                  </div>
                  {mockOrder.payment.cardLast4 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Card</span>
                      <span>**** **** **** {mockOrder.payment.cardLast4}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={mockOrder.payment.status === "paid" ? "outline" : "default"} className="capitalize">
                      {mockOrder.payment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>History of this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {mockOrder.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      {event.status === "order_placed" ? (
                        <Package className="h-3 w-3 text-primary-foreground" />
                      ) : event.status === "payment_received" ? (
                        <CreditCard className="h-3 w-3 text-primary-foreground" />
                      ) : event.status === "processing" ? (
                        <Package className="h-3 w-3 text-primary-foreground" />
                      ) : event.status === "shipped" ? (
                        <Truck className="h-3 w-3 text-primary-foreground" />
                      ) : (
                        <Calendar className="h-3 w-3 text-primary-foreground" />
                      )}
                      {index < mockOrder.timeline.length - 1 && (
                        <div className="absolute top-6 left-1/2 h-full w-px -translate-x-1/2 bg-border" />
                      )}
                    </div>
                    <div className="space-y-1 pb-8">
                      <p className="text-sm font-medium capitalize">{event.status.replace(/_/g, " ")}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
              <CardDescription>Add private notes about this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add notes about this order..."
                  className="min-h-[150px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button onClick={handleSaveNotes} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
