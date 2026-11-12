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
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AdminEmailNotificationsConfig, storeAdminEmailNotificationsConfigSchema } from '@/types/mail'
import { useRouter } from 'next/navigation'
import { updateStoreAdminEmailNotificationsConfig } from '@/actions/store'
import { useState } from 'react'


type AdminNotificationFormValues = z.infer<typeof storeAdminEmailNotificationsConfigSchema>

type Props = {
  initialData?: AdminEmailNotificationsConfig
  isApiKeyValid: boolean
}

export function StoreAdminNotificationsConfigForm({ initialData, isApiKeyValid }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<AdminNotificationFormValues>({
    resolver: zodResolver(storeAdminEmailNotificationsConfigSchema),
    defaultValues: initialData ? {
      ...initialData,
      "customerMessageNotificationEmail": initialData.customerMessageNotificationEmail ?? "",
      "orderNotificationEmail": initialData.orderNotificationEmail ?? "",
      "serviceNotificationEmail": initialData.serviceNotificationEmail ?? ""
    } : {
      notifyOnNewOrder: false,
      notifyOnOrderStatusChange: false,
      orderNotificationEmail: '',

      notifyOnServiceRequest: false,
      notifyOnServiceStatusChange: false,
      serviceNotificationEmail: '',

      notifyOnCustomerMessage: false,
      customerMessageNotificationEmail: '',
    },
  })

  const onSubmit = async (values: AdminNotificationFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await updateStoreAdminEmailNotificationsConfig(values)
      if(res.error) toast.error(res.error)
      else{
        toast.success("Your Admin email notification settings has been updated successfully.")
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
            <CardTitle>Admin Notifications</CardTitle>
            <CardDescription>
              Configure when and where to receive notifications about store activities.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Notifications */}
            <div className="space-y-4">
              <h4 className="font-medium">Order Notifications</h4>
              <div className="space-y-4 ml-4">
                <FormField
                  control={form.control}
                  name="notifyOnNewOrder"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>New Order Notifications</FormLabel>
                        <FormDescription>
                          Get notified when customers place new orders
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch disabled={!isApiKeyValid} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notifyOnOrderStatusChange"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Order Status Changes</FormLabel>
                        <FormDescription>
                          Get notified when customers cancel or modify orders
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch disabled={!isApiKeyValid} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderNotificationEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notification Email</FormLabel>
                      <FormControl>
                        <Input placeholder="orders@yourstore.com" disabled={!isApiKeyValid} {...field} />
                      </FormControl>
                      <FormDescription>Specific email for order notifications</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Service Notifications */}
            <div className="space-y-4">
              <h4 className="font-medium">Service Notifications</h4>
              <div className="space-y-4 ml-4">
                <FormField
                  control={form.control}
                  name="notifyOnServiceRequest"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>New Service Requests</FormLabel>
                        <FormDescription>Get notified when customers request services</FormDescription>
                      </div>
                      <FormControl>
                        <Switch disabled={!isApiKeyValid} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notifyOnServiceStatusChange"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Service Status Changes</FormLabel>
                        <FormDescription>Get notified when service status changes</FormDescription>
                      </div>
                      <FormControl>
                        <Switch disabled={!isApiKeyValid} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceNotificationEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Notification Email</FormLabel>
                      <FormControl>
                        <Input placeholder="services@yourstore.com" disabled={!isApiKeyValid} {...field} />
                      </FormControl>
                      <FormDescription>Specific email for service notifications</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Customer Communication */}
            <div className="space-y-4">
              <h4 className="font-medium">Customer Communication</h4>
              <div className="space-y-4 ml-4">
                <FormField
                  control={form.control}
                  name="notifyOnCustomerMessage"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Customer Messages</FormLabel>
                        <FormDescription>Get notified when customers send messages</FormDescription>
                      </div>
                      <FormControl>
                        <Switch disabled={!isApiKeyValid} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerMessageNotificationEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Notification Email</FormLabel>
                      <FormControl>
                        <Input placeholder="support@yourstore.com" disabled={!isApiKeyValid} {...field} />
                      </FormControl>
                      <FormDescription>Email for customer message notifications</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* API Key Warning */}
            {!isApiKeyValid && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>API Key Required:</strong> Admin notifications require a valid Resend API key.
                  Configure your API key above to enable these features.
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
