"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { paymentMethodsFormSchema } from "@/db/schema/storePaymentMethods"
import { updateStorePaymentMethods } from "@/actions/store"
import { useState } from "react"

export type PaymentMethodsFormValues = z.infer<typeof paymentMethodsFormSchema>

export function StorePaymentMethodsForm({initialData}:{initialData?:Partial<z.infer<typeof paymentMethodsFormSchema>>}) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<PaymentMethodsFormValues>({
    resolver: zodResolver(paymentMethodsFormSchema),
    defaultValues: {
      cash: initialData?.cash ?? true,
      creditCard: initialData?.creditCard ?? false,
      paypal: initialData?.paypal ?? false,
      applePay: initialData?.applePay ?? false,
      googlePay: initialData?.googlePay ?? false
    }
  })

  const onSubmit = async (values: PaymentMethodsFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStorePaymentMethods(values)
      if (res.error) toast.error(res.error)
      else if (res.success) toast.success("Store Payment settings saved successfully.")
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Configure the payment methods available in your store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="cash"
              render={({ field }) => (
                <FormItem className=" space-y-2">
                  <div className=" flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-6 bg-[#1FCF7F] rounded flex items-center justify-center text-white text-xs font-bold">
                        Cash
                      </div>
                      <div>
                        <p className="font-medium">Cash</p>
                        <p className="text-sm text-muted-foreground">
                          Accept Cash on delivery
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="creditCard"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-6 bg-[#1A1F71] rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">Credit Card (Stripe)</p>
                      <p className="text-sm text-muted-foreground">
                        Accept Visa, Mastercard, Amex
                      </p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch disabled checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="paypal"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-6 bg-[#003087] rounded flex items-center justify-center text-white text-xs font-bold">
                      PP
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">
                        Accept PayPal payments
                      </p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch disabled checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="applePay"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
                      AP
                    </div>
                    <div>
                      <p className="font-medium">Apple Pay</p>
                      <p className="text-sm text-muted-foreground">
                        Accept Apple Pay payments
                      </p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch disabled checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="googlePay"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-6 bg-[#4285F4] rounded flex items-center justify-center text-white text-xs font-bold">
                      GP
                    </div>
                    <div>
                      <p className="font-medium">Google Pay</p>
                      <p className="text-sm text-muted-foreground">
                        Accept Google Pay payments
                      </p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch disabled checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={isLoading} type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
