"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form"

import { z } from "zod"
import { aboutPageContentFormSchema } from "@/db/schema/aboutPageContent"
import { useState } from "react"
import { updateStoreAboutPageContent } from "@/actions/store"

export type AboutContentFormValues = z.infer<typeof aboutPageContentFormSchema>


export function StoreAboutPageForm({ initialData }: { initialData?: AboutContentFormValues }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<AboutContentFormValues>({
    resolver: zodResolver(aboutPageContentFormSchema),
    defaultValues: initialData ?? {
      mission:
        "To provide high-quality products at fair prices while delivering exceptional customer service that exceeds expectations and builds lasting relationships.",
      vision:
        "To become the most trusted and beloved retail destination, known for our commitment to quality, innovation, and community impact.",
      values:
        "Integrity, customer-centricity, sustainability, innovation, and community. These values guide every decision we make and every interaction we have.",
      heroTitle: "About Our Store",
      heroDescription:
        "Since 2018, we've been dedicated to providing exceptional products and outstanding customer service. Our journey began with a simple mission: to make quality shopping accessible, enjoyable, and meaningful for everyone.",
      yearsInBusiness: "7+",
      happyCustomers: "50K+",
      productsAvailable: "10K+",
    },
  })

  const onSubmit = async (values: AboutContentFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreAboutPageContent(values)
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
            <CardTitle>About Page Content</CardTitle>
            <CardDescription>
              Manage the content displayed on your About Us page.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Hero Title */}
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hero Description */}
            <FormField
              control={form.control}
              name="heroDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Section Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="yearsInBusiness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years in Business</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="happyCustomers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Happy Customers</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productsAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products Available</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            {/* Mission */}
            <FormField
              control={form.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mission Statement</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vision */}
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vision Statement</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Values */}
            <FormField
              control={form.control}
              name="values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Values Statement</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
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
