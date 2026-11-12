'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { UserEmailPreferences } from '@/types/userPreference'
import { insertUserEmailPreferencesSchema } from '@/db/schema/userPreferences'
import { Button } from '../ui/button'
import { updateUserEmailPreferences } from '@/actions/user'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

type EmailPreferences = z.infer<typeof insertUserEmailPreferencesSchema>

type Props = {
  emailPrefs:UserEmailPreferences
}

export default function CustomerEmailPreferences({emailPrefs}:Props) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm<EmailPreferences>({
    resolver: zodResolver(insertUserEmailPreferencesSchema),
    defaultValues: {
      orderUpdates: emailPrefs.orderUpdates ?? false,
      promotions: emailPrefs.promotions ?? false,
      newsletter: emailPrefs.newsletter ?? false,
      recommendations: emailPrefs.recommendations ?? false,
    },
  })

  const onSubmit = async (values:Partial<UserEmailPreferences>)=>{
    setIsLoading(true)
    try {
      const res = await updateUserEmailPreferences(values)
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["current-user"]})
        toast.success(t('you-password-has-been-updated-successfully'))
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('email-preferences')}</CardTitle>
        <CardDescription>{t('choose-what-emails-you-want-to-receive-from-us')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {Object.keys(form.getValues()).map((key, index, arr) => (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof EmailPreferences}
                render={({ field }) => (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel htmlFor={key}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          {key === 'orderUpdates' && t('receive-updates-about-your-orders-and-shipping')}
                          {key === 'promotions' && t('get-notified-about-sales-and-special-offers')}
                          {key === 'newsletter' && t('weekly-newsletter-with-new-products-and-tips')}
                          {key === 'recommendations' && t('personalized-product-recommendations')}
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          id={key}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    {index < arr.length - 1 && <Separator className="mt-6" />}
                  </div>
                )}
              />
            ))}
            <Button disabled={isLoading} type="submit">{t('save-changes')}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
