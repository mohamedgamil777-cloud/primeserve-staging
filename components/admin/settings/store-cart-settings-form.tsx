"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

import { insertStoreCartSettingsSchema } from "@/db/schema/storeCartSettings"
import { updateStoreCartSettings } from "@/actions/store"
import type { z } from "zod"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

type CartSettingsFormValues = z.infer<typeof insertStoreCartSettingsSchema>

export const storeCartSettingsDefaultValues = {
  "maxItemsPerOrder":100,
  "minItemsPerOrder":1,
  "rewardEnabled":true,
  "promotionEnabled":true,
  "minPurchaseAmount":50,
  "maxPurchaseAmount":25_000
}

export function StoreCartSettingsForm({
  initialData = storeCartSettingsDefaultValues,
}: {
  initialData?: CartSettingsFormValues
}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CartSettingsFormValues>({
    resolver: zodResolver(insertStoreCartSettingsSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (values: CartSettingsFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreCartSettings(values)
      if (res.error) toast.error(res.error)
      else if (res.success) toast.success("Cart settings saved successfully.")
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
            <CardTitle>Cart Settings</CardTitle>
            <CardDescription>
              Customize how your products, services, and categories appear to customers.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minPurchaseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" value={field.value ?? 0} onChange={(e)=>field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPurchaseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Purchase Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" value={field.value ?? 0} onChange={(e)=>field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minItemsPerOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Items per Order</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" value={field.value ?? 0} onChange={(e)=>field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxItemsPerOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Items per Order</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" value={field.value ?? 0} onChange={(e)=>field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="rewardEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel>Rewards Enabled</FormLabel>
                    <p className="text-sm text-muted-foreground">Allow customers to apply redeemed rewards to their cart</p>
                  </div>
                  <FormControl>
                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="promotionEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel>Promotion Enabled</FormLabel>
                    <p className="text-sm text-muted-foreground">Allow customers to apply promotion codes to their cart</p>
                  </div>
                  <FormControl>
                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
