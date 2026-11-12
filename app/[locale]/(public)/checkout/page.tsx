"use client"

import { useState } from "react"
import AuthToCheckout from "@/components/auth/auth-to-checkout"
import OrderConfirmed from "@/components/order/order-confirmed"
import OrderCheckout from "@/components/order/order-checkout"
import CheckoutOrderSummary from "@/components/order/checkout-order-summary"

export default function CheckoutPage() {
  const [orderId, setOrderId] = useState<string|undefined>(undefined)

  if (orderId) {
    return (
      <OrderConfirmed orderId={orderId}/>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="space-y-8">
              {/* Login/Signup Section */}
              <AuthToCheckout>
                <OrderCheckout setOrderId={setOrderId}/>
              </AuthToCheckout>
            </div>
          </div>
          {/* Order Summary */}
          <CheckoutOrderSummary/>          
        </div>
      </div>
    </div>
  )
}
