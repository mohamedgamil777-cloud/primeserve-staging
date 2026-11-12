import { useTranslations } from "next-intl"
import { Check } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"

type Props = {orderId:string}

export default function OrderConfirmed({orderId}: Props) {
  const tu = useTranslations("ui")
  const router = useRouter()
  return (
    <div className="container flex flex-col items-center justify-center px-4 py-16 md:px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-4 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">{tu("orderConfirmed")}</h1>
        <p className="max-w-md text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
        <div className="mt-4 rounded-lg border p-4">
          <p className="font-medium">Order #{orderId}</p>
          <p className="text-sm text-muted-foreground">{tu("confirmationSent")}</p>
        </div>
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Return to Home
          </Button>
          <Button onClick={() => router.push("/products")}>{tu("continueShopping")}</Button>
        </div>
      </motion.div>
    </div>

  )
}