"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { z } from 'zod'
import { updateUserSchema } from '@/db/schema/users'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { updateUserInfo } from '@/actions/user'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { useTranslations } from 'next-intl'

type Props = {
  personalInfo?: Partial<z.infer<typeof updateUserSchema>>
}

export default function CustomerPersonalInfoForm({ personalInfo }: Props) {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      "email":personalInfo?.email ?? "",
      "firstName":personalInfo?.firstName ?? "",
      "lastName":personalInfo?.lastName ?? "",
      "phone":personalInfo?.phone ?? ""
    },
  })

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    setIsLoading(true)
    try {
      const res = await updateUserInfo(values)
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["current-user"]})
        toast.success(t('your-personal-information-has-been-updated-successfully'))
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('personal-information')}</CardTitle>
        <CardDescription>
          {t('update-your-personal-details-and-contact-information')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('first-name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('last-name')}</FormLabel>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email-address')}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone-number')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">{t('two-factor-authentication')}</Label>
                <p className="text-sm text-muted-foreground">{t('add-an-extra-layer-of-security-to-your-account')}</p>
              </div>
              <Switch id="two-factor" />
            </div>

            <Button disabled={isLoading} type="submit">{t('save-changes')}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
