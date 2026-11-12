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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { StoreAuthSupportSettings, storeAuthSupportSettingsSchema } from '@/types/mail'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateStoreAuthSupportSettings } from '@/actions/store'

type AuthSupportFormValues = z.infer<typeof storeAuthSupportSettingsSchema>

type Props = {
  initialData?: StoreAuthSupportSettings,
  isApiKeyValid: boolean
}

export function StoreAuthSupportSettingsForm({ initialData, isApiKeyValid }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const form = useForm<AuthSupportFormValues>({
    resolver: zodResolver(storeAuthSupportSettingsSchema),
    defaultValues: initialData ?? {
      supportPasswordReset: false,
      supportEmailVerification: false,
      supportPromotionalEmails: false,
    },
  })

  const onSubmit = async (values: AuthSupportFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await updateStoreAuthSupportSettings(values)
      if(res.error) toast.error(res.error)
      else{
        toast.success("Your auth support settings has been updated successfully.")
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
            <CardTitle>Authentication & Support Features</CardTitle>
            <CardDescription>
              Configure email-based authentication and support features for your customers.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="supportPasswordReset"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Password Reset Emails</FormLabel>
                    <FormDescription>
                      Allow customers to reset passwords via email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isApiKeyValid}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="supportEmailVerification"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Email Verification</FormLabel>
                    <FormDescription>
                      Require email verification for new accounts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isApiKeyValid}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="supportPromotionalEmails"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Promotional Emails</FormLabel>
                    <FormDescription>
                      Enable promotional and marketing email campaigns
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isApiKeyValid}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isApiKeyValid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  🚫 <strong>Critical Features Disabled:</strong> Password reset and email verification require a
                  valid API key. Customers will not be able to reset passwords or verify their email addresses
                  without proper configuration.
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
