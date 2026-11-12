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
import { loginSchema } from "@/types/auth"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useLocale } from "@/hooks/use-locale"
import { useRouter } from "next/navigation"
import { signin } from "@/actions/auth"
import { toast } from "sonner"
import { Header } from "@/components/layout/public/header"

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const locale = useLocale()
  const t = useTranslations()
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })


  async function onSubmit(values: LoginFormData) {
    setIsLoading(true)
    try {
      const res = await signin(values)
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["current-user"]})
        toast.success(t('you-have-logged-in-successfully'))
        if(res.userRole === "seller") router.push("/admin")
        else router.push("/account")
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsLoading(false)
  }

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-r from-[#0B1F33] to-[#00796B] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          </motion.div>
    
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
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
                          placeholder="Enter your email"
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
                transition={{ delay: 0.4, duration: 0.5 }}
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
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600">Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </motion.div>
    
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0B1F33] to-[#00796B] hover:from-[#132f4c] hover:to-[#00796B] text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
    
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-center space-y-4"
              >
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="from-[#0B1F33] to-[#00796B] text-primary text-sm font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
    
                <p className="text-gray-600 text-sm">
                  {"Don't have an account? "}
                  <Link
                    href={`/${locale}/auth/register`}
                    className="text-primary font-medium transition-colors duration-200"
                  >
                    Sign up
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
