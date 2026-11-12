"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form"

import { z } from "zod"
import { insertStoreContactInfoSchema, selectStoreContactInfoSchema } from "@/db/schema/contactInformation"
import { useState } from "react"
import { updateStoreContactInfo } from "@/actions/store"


export type ContactInfoFormValues = z.infer<typeof insertStoreContactInfoSchema>

export function StoreContactInfoForm({ initialData }: { initialData?: Partial<z.infer<typeof selectStoreContactInfoSchema>> }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(insertStoreContactInfoSchema),
    defaultValues: {
      "businessHours":initialData?.businessHours ?? "",
      "contactFormEnabled":initialData?.contactFormEnabled ?? false,
      "customerServicePhone":initialData?.customerServicePhone ?? "",
      "liveChatEnabled":initialData?.liveChatEnabled ?? false,
      "officeAddress":initialData?.officeAddress ?? "",
      "supportEmail":initialData?.supportEmail ?? ""
    },
  })

  const onSubmit = async (values: ContactInfoFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreContactInfo(values)
      if (res.error) toast.error(res.error)
      else if (res.success) toast.success("About Page content saved successfully.")
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
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Manage contact details displayed across your site.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerServicePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Service Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="officeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corporate Office Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Hours</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveChatEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel>Enable Live Chat</FormLabel>
                    <p className="text-sm text-muted-foreground">Allow customers to chat with support</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactFormEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel>Enable Contact Form</FormLabel>
                    <p className="text-sm text-muted-foreground">Show contact form on contact page</p>
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
