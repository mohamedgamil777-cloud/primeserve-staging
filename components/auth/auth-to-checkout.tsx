"use client"
import React, { PropsWithChildren, useState } from 'react'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { LogIn, UserPlus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { loginSchema, registerSchema, signupSchema } from '@/types/auth'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import ShippingAddressSectionSkeleton from '../order/shipping-address-section-skeleton'
import { toast } from 'sonner'
import { signin, signup } from '@/actions/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

type Props = {}

export default function AuthToCheckout({children}: PropsWithChildren<Props>) {
  const tx = useTranslations("ui")
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isLoading, data } = useCurrentUser()
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signupForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms:true,
      subscribeNewsletter:false,
    },
  })


  async function onLogin(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true)
    try {
      const res = await signin(values)
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["current-user"]})
        toast.success(t('you-have-logged-in-successfully-you-can-now-proceed-with-checkout'))
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsSubmitting(false)
  }

  async function onSignup(values: z.infer<typeof registerSchema>) {
    setIsSubmitting(true)
    try {
      const res = await signup(values)
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["current-user"]})
        toast.success(t('you-new-account-has-been-created-successfully-you-can-now-proceed-with-checkout'))
      }
    } catch (error) {
      toast.error(tx("somethingWrong"))
    }
    setIsSubmitting(false)
  }


  if(isLoading) return <ShippingAddressSectionSkeleton/>
  if(data?.id) return children
  return (
    <div className="rounded-lg border">
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{t('checkout')}</h1>
          <p className="text-muted-foreground">{t('sign-in-to-your-account-or-register-a-new-account-to-continue')}</p>
        </div>
      </div>
      <Separator />
      <div className="p-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              {t('sign-in')}
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {t('create-account')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email-address-0')}</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('enter-your-password')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t('signing-in') : t('sign-in-and-continue')}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={signupForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('first-name-0')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('last-name-0')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email-address-0')}</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('create-a-password')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('confirm-password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('confirm-your-password')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t('creating-account') : t('create-account-and-continue')}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>


  )
}