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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { insertStoreDisplaySettingsSchema } from "@/db/schema/storeDisplaySettings"
import { updateStoreDisplaySettings } from "@/actions/store"
import type { z } from "zod"
import { Switch } from "@/components/ui/switch"

type DisplaySettingsFormValues = z.infer<typeof insertStoreDisplaySettingsSchema>

const defaultValues: DisplaySettingsFormValues = {
  cartStyle: "card",
  productStyle: "simple",
  serviceStyle: "simple",
  categoryStyle: "simple",
  showFeaturedProducts: true,
}

export function StoreDisplaySettingsForm({
  initialData = defaultValues,
}: {
  initialData?: DisplaySettingsFormValues
}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DisplaySettingsFormValues>({
    resolver: zodResolver(insertStoreDisplaySettingsSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (values: DisplaySettingsFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreDisplaySettings(values)
      if (res.error) toast.error(res.error)
      else if (res.success) toast.success("Display settings saved successfully.")
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
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Customize how your products, services, and categories appear to customers.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Style</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className=" w-full">
                          <SelectValue placeholder="Select product style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Style</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className=" w-full">
                          <SelectValue placeholder="Select service style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Style</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className=" w-full">
                          <SelectValue placeholder="Select category style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cartStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cart Style</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className=" w-full">
                          <SelectValue placeholder="Select cart style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="showFeaturedProducts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel>Show Featured Products</FormLabel>
                    <p className="text-sm text-muted-foreground">Show Featured Products in the home page</p>
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
