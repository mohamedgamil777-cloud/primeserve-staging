"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form"


import { z } from "zod"
import { shippingSchema } from "@/db/schema/storeShippingMethods"
import { useState } from "react"
import { updateStoreShippingMethods } from "@/actions/store"

export type ShippingFormValues = z.infer<typeof shippingSchema>


export function StoreShippingForm({ initialData }: { initialData?: Partial<ShippingFormValues> }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      "express":initialData?.express ?? {"enabled":false,"cost":0},
      "international":initialData?.international ?? {"enabled":false,"cost":0},
      "standard":initialData?.standard ?? {"enabled":false,"cost":0},
      "free":initialData?.free ?? {"enabled":false,"cost":0},
    },
  })

  const onSubmit = async (values: ShippingFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreShippingMethods(values)
      if (res.error) toast.error(res.error)
      else if (res.success) toast.success("Store Shipping settings saved successfully.")
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
            <CardTitle>Shipping Methods</CardTitle>
            <CardDescription>
              Configure shipping options for your store and the cost of each option.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Standard Shipping */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Standard Shipping</p>
                <p className="text-sm text-muted-foreground">3–5 business days</p>
              </div>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="standard.enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="standard.cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="w-24" {...field} onChange={(e)=>field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Express Shipping */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Express Shipping</p>
                <p className="text-sm text-muted-foreground">1–2 business days</p>
              </div>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="express.enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="express.cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="w-24" {...field} onChange={(e)=>field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Free Shipping */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">For orders over a certain amount</p>
                <p className="text-sm text-yellow-600">The amount you specify here, will be the min order subtotal above which the order will be delivered for free.</p>
              </div>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="free.enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="free.cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="w-24" {...field} onChange={(e)=>field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* International Shipping */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">International Shipping</p>
                <p className="text-sm text-muted-foreground">7–14 business days</p>
              </div>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="international.enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="international.cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="w-24" {...field} onChange={(e)=>field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button disabled={isLoading} type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
