"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"


export function Newsletter() {
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = z.object({
    email: z.string().email({ message: t('please-enter-a-valid-email-address') }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Subscribed!",
      description: t('youve-successfully-subscribed-to-our-newsletter'),
    })

    form.reset()
    setIsSubmitting(false)
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t('stay-updated')}</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('subscribe-to-our-newsletter-to-receive-updates-on-new-arrivals-special-offers-and-exclusive-discounts')}
            </p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={t('enter-your-email')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Subscribing..." : t('subscribe')}
                </Button>
              </form>
            </Form>
            <p className="text-xs text-muted-foreground">
              {t('by-subscribing-you-agree-to-our-terms-of-service-and-privacy-policy')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
