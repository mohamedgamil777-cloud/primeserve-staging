"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import Link from "next/link"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { registerSchema } from "@/types/auth"
import { useLocale } from "@/hooks/use-locale"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { signup } from "@/actions/auth"
import { toast } from "sonner"
import { Header } from "@/components/layout/public/header"

type RegisterFormData = z.infer<typeof registerSchema>

export default function SignupForm() {
  const locale = useLocale()
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      subscribeNewsletter: false,
    },
  })

  async function onSubmit(values: RegisterFormData) {
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

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-[#0B1F33] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-xl shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
            <p className="text-gray-600">Create your account</p>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="john@example.com"
                          className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="010 1234 5678"
                          className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                            className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm your password"
                            className="border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600">
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                            Terms and Conditions
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
                        <FormLabel className="text-sm text-gray-600">Subscribe to our newsletter</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0B1F33] to-[#00796B] hover:from-[#132f4c] hover:to-[#00796B] text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-primary font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                </p>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </div>
    </>
  )
}
