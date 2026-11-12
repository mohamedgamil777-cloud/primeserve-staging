"use client"
import { Badge } from '@/components/ui/badge'
import { CreditCard } from 'lucide-react'
import React from 'react'

type Props = {
  customerId:string
}

export default function CustomerPaymentMethods({customerId}: Props) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Payment Methods</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-md border p-2 text-sm">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <p>
                Cash
                <Badge variant="outline" className="ml-2">
                  Default
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground">
                Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}