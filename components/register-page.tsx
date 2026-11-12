"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, X, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { registerSchema } from "@/types/auth"
import { toast } from "sonner"
import { signup } from "@/actions/auth"
import { useQueryClient } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"


type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const locale = useLocale()
  const t = useTranslations()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone:"",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      subscribeNewsletter: false,
    },
  })

  const password = form.watch("password")

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength(password)

  const getPasswordStrengthText = (strength: number) => {
    if (strength === 0) return t('enter-a-password')
    if (strength <= 25) return t('weak')
    if (strength <= 50) return t('fair')
    if (strength <= 75) return t('good')
    return t('strong')
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return "bg-red-500"
    if (strength <= 50) return "bg-orange-500"
    if (strength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true)
    try {
      const res = await signup(values)
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["current-user"]})
        toast.success(t('you-new-account-has-been-created-successfully'))
        //TODO: should be redirected to mail verification page
        router.push("/products") 
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = (provider: string) => {
    toast.warning(`${provider} authentication is not supported yet.`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href={`/${locale}/`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back-to-store')}
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{t('create-your-account')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('or')}{" "}
            <Link href={`/${locale}/auth/login`} className="font-medium text-primary hover:underline">
              {t('sign-in-to-your-existing-account')}
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('get-started')}</CardTitle>
            <CardDescription>{t('create-your-account-to-start-shopping')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Registration Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" onClick={() => handleSocialRegister("Google")} className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('continue-with-google')}
              </Button>
              <Button variant="outline" onClick={() => handleSocialRegister("Apple")} className="w-full">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 8.025.044 8.025.044c0 0-.396.044-.396.044C3.891.088 0 3.979 0 8.017c0 4.624 3.374 8.467 7.815 8.467 2.32 0 4.202-1.256 4.202-1.256s1.882 1.256 4.202 1.256C20.626 16.484 24 12.641 24 8.017 24 3.979 20.109.088 16.371.044c0 0-.396-.044-.396-.044C15.975.044 15.604 0 12.017 0z" />
                </svg>
                {t('continue-with-apple')}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t('or-continue-with-email')}</span>
              </div>
            </div>

            {/* Registration Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('first-name-0')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="John" className="pl-10" />
                          </div>
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
                        <FormLabel>{t('last-name-0')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Doe" />
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
                      <FormLabel>{t('email-address-0')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} type="email" placeholder="john@example.com" className="pl-10" />
                        </div>
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
                      <FormLabel>{t('phone-number-optional')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone 
                            className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                          />
                          <Input 
                            {...field} 
                            type="tel" 
                            placeholder="01xxxxxxxxx" 
                            className="pl-10" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t('create-a-password')}
                            className="pl-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      {password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{t('password-strength')}</span>
                            <span
                              className={`font-medium ${
                                passwordStrength <= 25
                                  ? "text-red-500"
                                  : passwordStrength <= 50
                                    ? "text-orange-500"
                                    : passwordStrength <= 75
                                      ? "text-yellow-500"
                                      : "text-green-500"
                              }`}
                            >
                              {getPasswordStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <Progress value={passwordStrength} className="h-2" />
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              {password.length >= 8 ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span className={password.length >= 8 ? "text-green-500" : "text-red-500"}>
                                {t('8-characters')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {/[A-Z]/.test(password) ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span className={/[A-Z]/.test(password) ? "text-green-500" : "text-red-500"}>
                                {t('uppercase')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {/[a-z]/.test(password) ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span className={/[a-z]/.test(password) ? "text-green-500" : "text-red-500"}>
                                {t('lowercase')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {/[0-9]/.test(password) ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span className={/[0-9]/.test(password) ? "text-green-500" : "text-red-500"}>{t('number')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('confirm-password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t('confirm-your-password')}
                            className="pl-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            {t('i-agree-to-the')}{" "}
                            <Link href={`/${locale}/terms`} className="text-primary hover:underline">
                              {t('terms-of-service')}
                            </Link>{" "}
                            and{" "}
                            <Link href={`/${locale}/privacy`} className="text-primary hover:underline">
                              {t('privacy-policy')}
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subscribeNewsletter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            {t('subscribe-to-our-newsletter-for-updates-and-exclusive-offers')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('creating-account') : t('create-account-0')}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              {t('already-have-an-account')}{" "}
              <Link href={`/${locale}/auth/login`} className="font-medium text-primary hover:underline">
                {t('sign-in-0')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
