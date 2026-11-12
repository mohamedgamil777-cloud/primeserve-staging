'use client'

import React from 'react'
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
import { UserPrivacyPreferences } from '@/types/userPreference'
import { insertUserPrivacyPreferencesSchema } from '@/db/schema/userPreferences'

type PrivacySettings = z.infer<typeof insertUserPrivacyPreferencesSchema>
type Props = {
  privacyPreferences:UserPrivacyPreferences
}


export default function CustomerPrivacySettings({privacyPreferences}:Props) {
  const form = useForm<PrivacySettings>({
    resolver: zodResolver(insertUserPrivacyPreferencesSchema),
    defaultValues: {
      profileVisible: privacyPreferences.profileVisible ?? false,
      orderHistoryVisible: privacyPreferences.orderHistoryVisible ?? false,
      reviewsVisible: privacyPreferences.reviewsVisible ?? false,
      wishlistVisible: privacyPreferences.wishlistVisible ?? false,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control what information is visible to other users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          {Object.keys(form.getValues()).map((key, index, arr) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof PrivacySettings}
              render={({ field }) => (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel htmlFor={key}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {key === 'profileVisible' && 'Allow others to see your profile information'}
                        {key === 'orderHistoryVisible' && 'Show your order history to other users'}
                        {key === 'reviewsVisible' && 'Display your product reviews publicly'}
                        {key === 'wishlistVisible' && 'Make your wishlist visible to others'}
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
        </Form>
      </CardContent>
    </Card>
  )
}
