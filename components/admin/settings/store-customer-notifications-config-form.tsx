'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AdminCustomerNotificationsConfig, storeCustomerEmailNotificationsConfigSchema } from '@/types/mail'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateStoreCustomerEmailNotificationsConfig } from '@/actions/store'

type CustomerNotificationFormValues = z.infer<typeof storeCustomerEmailNotificationsConfigSchema>

type Props = {
  initialData?: AdminCustomerNotificationsConfig
  isApiKeyValid: boolean
}

export function StoreCustomerNotificationsConfigForm({ initialData, isApiKeyValid }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<CustomerNotificationFormValues>({
    resolver: zodResolver(storeCustomerEmailNotificationsConfigSchema),
    defaultValues: initialData || {
      notifyCustomerOnOrderStatusChange: false,
      notifyCustomerOnServiceStatusChange: false,
    },
  })

  const onSubmit = async(values: CustomerNotificationFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await updateStoreCustomerEmailNotificationsConfig(values)
      if(res.error) toast.error(res.error)
      else{
        toast.success("Your Customer email notification settings has been updated successfully.")
        router.refresh()
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Customer Notifications</CardTitle>
            <CardDescription>
              Configure automated emails sent to customers about their orders and services.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="notifyCustomerOnOrderStatusChange"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Order Status Updates</FormLabel>
                    <FormDescription>
                      Send emails when order status changes (shipped, delivered, etc.)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={!isApiKeyValid}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="notifyCustomerOnServiceStatusChange"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Service Status Updates</FormLabel>
                    <FormDescription>
                      Send emails when service status changes (scheduled, completed, etc.)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={!isApiKeyValid}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isApiKeyValid && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>API Key Required:</strong> Customer notifications require a valid Resend API key.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!isApiKeyValid || isSubmitting}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
