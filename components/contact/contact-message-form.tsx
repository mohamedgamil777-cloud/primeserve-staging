"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { List, Loader2, Mail, MessageSquareText, PenLine, Send, User } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitContactForm } from "@/actions/mail"
import { contactUsformSchema } from "@/types/mail"
import { messageCategory } from "@/db/schema/messages"
import { useCurrentUser } from "@/hooks/use-current-user"

type Values = z.infer<typeof contactUsformSchema>

function FieldIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085] ltr:left-3 rtl:right-3" />
}

export default function ContactMessageForm() {
  const t = useTranslations("contactPage")
  const { data: user } = useCurrentUser()
  const [isSending, setIsSending] = useState(false)
  const form = useForm<Values>({
    resolver: zodResolver(contactUsformSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  useEffect(() => {
    if (user && !form.getValues("name")) form.setValue("name", `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim())
  }, [user, form])

  async function onSubmit(values: Values) {
    setIsSending(true)
    const res = await submitContactForm(values)
    setIsSending(false)
    if (res && "success" in res) {
      toast.success(t("success"))
      form.reset({ name: values.name, email: values.email, subject: "", message: "", category: undefined })
    } else {
      toast.error(t("error"))
    }
  }

  const label = (text: string) => (
    <FormLabel className="font-semibold text-[#0B1F33]">
      {text} <span className="text-[#F26522]">*</span>
    </FormLabel>
  )
  const withIcon = "h-11 ltr:pl-10 rtl:pr-10"

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-[#0B1F33] md:text-3xl">{t("formTitle")}</h2>
      <p className="mb-6 mt-1 text-[#667085]">{t("formText")}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                {label(t("fullName"))}
                <div className="relative"><FieldIcon icon={User} /><FormControl><Input className={withIcon} placeholder={t("fullNamePh")} {...field} /></FormControl></div>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                {label(t("email"))}
                <div className="relative"><FieldIcon icon={Mail} /><FormControl><Input type="email" className={withIcon} placeholder={t("emailPh")} {...field} /></FormControl></div>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                {label(t("category"))}
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <span className="flex items-center gap-2"><List className="h-4 w-4 text-[#667085]" /><SelectValue placeholder={t("categoryPh")} /></span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {messageCategory.map((c) => <SelectItem key={c} value={c}>{t(`categories.${c}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="subject" render={({ field }) => (
              <FormItem>
                {label(t("subject"))}
                <div className="relative"><FieldIcon icon={PenLine} /><FormControl><Input className={withIcon} placeholder={t("subjectPh")} {...field} /></FormControl></div>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem>
              {label(t("message"))}
              <div className="relative">
                <MessageSquareText className="pointer-events-none absolute top-3 h-4 w-4 text-[#667085] ltr:left-3 rtl:right-3" />
                <FormControl><Textarea rows={5} className="ltr:pl-10 rtl:pr-10" placeholder={t("messagePh")} {...field} /></FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )} />
          <button
            type="submit"
            disabled={isSending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#F26522] text-base font-semibold text-white transition-colors hover:bg-[#d9541a] disabled:opacity-60"
          >
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 rtl:-scale-x-100" />}
            {isSending ? t("sending") : t("send")}
          </button>
        </form>
      </Form>
    </div>
  )
}
