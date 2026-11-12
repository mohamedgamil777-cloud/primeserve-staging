"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { insertStoreTaxSettingsSchema } from "@/db/schema/storeTaxSettings"
import { useState } from "react"
import { updateStoreTaxSettings } from "@/actions/store"


export type TaxSettingsFormValues = z.infer<typeof insertStoreTaxSettingsSchema>


export function StoreTaxSettingsForm({initialData}:{initialData?:Partial<TaxSettingsFormValues>}) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<TaxSettingsFormValues>({
    resolver: zodResolver(insertStoreTaxSettingsSchema),
    defaultValues: {
      enableTax: initialData?.enableTax ?? true,
      defaultRate: initialData?.defaultRate ?? 8.5,
      pricesIncludeTax: initialData?.pricesIncludeTax ?? false
    }
  })

  const onSubmit = async (values: TaxSettingsFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreTaxSettings(values)
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
            <CardTitle>Tax Settings</CardTitle>
            <CardDescription>Configure tax rates and settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enableTax"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Tax Calculation</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically calculate taxes at checkout
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} onChange={(e)=>field.onChange(parseFloat(e.target.value))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricesIncludeTax"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Prices Including Tax</p>
                    <p className="text-sm text-muted-foreground">
                      Display product prices with tax included
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
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
