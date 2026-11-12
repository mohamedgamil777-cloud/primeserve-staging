"use client"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { z } from "zod"
import { insertStoreSocialMediaInfoSchema, selectSocialMediaInfoSchema } from "@/db/schema/contactInformation"
import { updateStoreSocialMediaInfo } from "@/actions/store"
import { useState } from "react"



export type SocialLinksFormValues = z.infer<typeof insertStoreSocialMediaInfoSchema>


export function StoreSocialMediaForm({initialData}:{initialData?:Partial<z.infer<typeof selectSocialMediaInfoSchema>>}) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<SocialLinksFormValues>({
    resolver: zodResolver(insertStoreSocialMediaInfoSchema),
    defaultValues: {
      "facebook":initialData?.facebook ?? "",
      "twitter":initialData?.twitter ?? "",
      "tiktok":initialData?.tiktok ?? "",
      "instagram":initialData?.instagram ?? "",
      "pinterest":initialData?.pinterest ?? "",
      "youtube":initialData?.youtube ?? "",
    }
  })

  const onSubmit = async (values: SocialLinksFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreSocialMediaInfo(values)
      if (res.error) toast.error(res.error)
      else if (res.success) toast.success("Social links saved successfully.")
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
    setIsLoading(false)
    toast.success("Social links saved!")
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Connect your store to social media platforms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name={`facebook`}
              render={({ field }) => (
                <FormItem className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <FormLabel className="capitalize">
                    Facebook
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`https://facebook.com/yourstore`}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`twitter`}
              render={({ field }) => (
                <FormItem className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <FormLabel className="capitalize">
                    Twitter
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`https://x.com/yourstore`}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`instagram`}
              render={({ field }) => (
                <FormItem className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <FormLabel className="capitalize">
                    Instagram
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`https://instagram.com/yourstore`}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`tiktok`}
              render={({ field }) => (
                <FormItem className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <FormLabel className="capitalize">
                    Tiktok
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`https://tiktok.com/yourstore`}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"pinterest"}
              render={({ field }) => (
                <FormItem className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <FormLabel className="capitalize">
                    Pinterest
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`https://pinterest.com/yourstore`}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"youtube"}
              render={({ field }) => (
                <FormItem className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <FormLabel className="capitalize">
                    Youtube
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`https://youtube.com/yourstore`}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2" />
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
