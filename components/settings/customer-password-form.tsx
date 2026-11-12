'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Eye, EyeOff } from 'lucide-react'
import { updatePasswordSchema } from '@/types/auth'
import { changePassword } from '@/actions/auth'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'



type PasswordFormValues = z.infer<typeof updatePasswordSchema>

export default function CustomerPasswordForm() {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const toggle = (key: keyof typeof show) => {
    setShow((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const onSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true)
    try {
      const res = await changePassword(values)
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
        <CardTitle>{t('change-password')}</CardTitle>
        <CardDescription>{t('update-your-password-to-keep-your-account-secure')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('current-password')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={show.current ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => toggle('current')}
                    >
                      {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('new-password')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={show.new ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => toggle('new')}
                    >
                      {show.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirm-new-password')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={show.confirm ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => toggle('confirm')}
                    >
                      {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit">{t('update-password')}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
