import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, ShoppingBag, User } from 'lucide-react'
import React from 'react'

type Props = {
  customerId:string
}

export default function CustomerActivityLogs({}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent activity for this customer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
              <User className="h-3 w-3 text-primary-foreground" />
              <div className="absolute top-6 left-1/2 h-full w-px -translate-x-1/2 bg-border" />
            </div>
            <div className="space-y-1 pb-8">
              <p className="text-sm font-medium">Logged in</p>
              <p className="text-sm text-muted-foreground">Customer logged in to their account</p>
              <p className="text-xs text-muted-foreground">May 14, 2023 at 10:30 AM</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
              <ShoppingBag className="h-3 w-3 text-primary-foreground" />
              <div className="absolute top-6 left-1/2 h-full w-px -translate-x-1/2 bg-border" />
            </div>
            <div className="space-y-1 pb-8">
              <p className="text-sm font-medium">Placed order</p>
              <p className="text-sm text-muted-foreground">Customer placed order #ORD-001</p>
              <p className="text-xs text-muted-foreground">May 14, 2023 at 11:15 AM</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
              <CreditCard className="h-3 w-3 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Payment processed</p>
              <p className="text-sm text-muted-foreground">
                Payment for order #ORD-001 was processed successfully
              </p>
              <p className="text-xs text-muted-foreground">May 14, 2023 at 11:17 AM</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}