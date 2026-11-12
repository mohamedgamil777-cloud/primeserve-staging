"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  Building2,
  FileText,
  Headphones,
  Loader2,
  MessageSquareMore,
  Send,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitSupportRequest } from "@/actions/support"
import { supportPriorities, supportTypes, type SupportType } from "@/types/support"
import { useCurrentUser } from "@/hooks/use-current-user"

const typeStyles: Record<SupportType, { icon: LucideIcon; circle: string; button: string }> = {
  procurement: { icon: ShoppingCart, circle: "bg-slate-100 text-[#0b2545]", button: "border-[#f26522] text-[#f26522] hover:bg-[#f26522]/10" },
  facility: { icon: Building2, circle: "bg-orange-50 text-[#f26522]", button: "border-[#f26522] text-[#f26522] hover:bg-[#f26522]/10" },
  hr: { icon: Users, circle: "bg-emerald-50 text-emerald-700", button: "border-emerald-600 text-emerald-700 hover:bg-emerald-50" },
  technical: { icon: Headphones, circle: "bg-blue-50 text-[#0b2545]", button: "border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50" },
  finance: { icon: FileText, circle: "bg-orange-50 text-[#f26522]", button: "border-[#f26522] text-[#f26522] hover:bg-[#f26522]/10" },
  general: { icon: MessageSquareMore, circle: "bg-emerald-50 text-emerald-700", button: "border-emerald-600 text-emerald-700 hover:bg-emerald-50" },
}

export default function SupportHubRequest({ sidebar }: { sidebar: React.ReactNode }) {
  const t = useTranslations("supportHub")
  const { data: user } = useCurrentUser()
  const [isSending, setIsSending] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const schema = z.object({
    name: z.string().trim().min(2, t("required")),
    company: z.string().trim().min(2, t("required")),
    jobTitle: z.string().trim().optional(),
    phone: z.string().trim().regex(/^[0-9\s-]{8,15}$/, t("invalidPhone")),
    email: z.string().trim().email(t("invalidEmail")),
    supportType: z.enum(supportTypes, { errorMap: () => ({ message: t("required") }) }),
    priority: z.enum(supportPriorities, { errorMap: () => ({ message: t("required") }) }),
    branch: z.string().trim().min(2, t("required")),
    details: z.string().trim().min(10, t("detailsMin")),
  })
  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", company: "", jobTitle: "", phone: "", email: "", branch: "", details: "" },
  })

  useEffect(() => {
    if (!user) return
    if (!form.getValues("name")) form.setValue("name", `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim())
  }, [user, form])

  // Lets the hero and CTA buttons (links to #request?type=...) pick a type too.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type")
    if (type && (supportTypes as readonly string[]).includes(type)) form.setValue("supportType", type as SupportType)
  }, [form])

  function chooseType(type: SupportType) {
    form.setValue("supportType", type, { shouldValidate: true })
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  async function onSubmit(values: FormValues) {
    setIsSending(true)
    const phone = values.phone.replace(/^0+/, "")
    const res = await submitSupportRequest({ ...values, phone: `+20 ${phone}` })
    setIsSending(false)
    if (res && "success" in res) {
      toast.success(t("success"))
      form.reset({ name: values.name, email: values.email, company: values.company, jobTitle: values.jobTitle, phone: values.phone, branch: values.branch, details: "" })
    } else {
      toast.error(t("error"))
    }
  }

  const label = (text: string, required = true) => (
    <FormLabel className="text-xs font-semibold text-[#0b2545]">
      {text}
      {required && <span className="text-[#f26522]"> *</span>}
    </FormLabel>
  )

  return (
    <>
      {/* Support types */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#0b2545] mb-8">{t("chooseTitle")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {supportTypes.map((type) => {
            const style = typeStyles[type]
            const Icon = style.icon
            return (
              <div key={type} className="flex flex-col items-center rounded-xl border bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-full", style.circle)}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-bold text-[#0b2545]">{t(`types.${type}.title`)}</h3>
                <p className="mb-5 flex-1 text-sm text-muted-foreground">{t(`types.${type}.text`)}</p>
                <button
                  type="button"
                  onClick={() => chooseType(type)}
                  className={cn("w-full rounded-md border px-3 py-2 text-sm font-semibold transition-colors", style.button)}
                >
                  {t(`types.${type}.action`)}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Form + contact sidebar */}
      <section id="request" className="container mx-auto px-4 md:px-6 pb-12 scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-3">
          <div ref={formRef} className="scroll-mt-24 rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-6 text-xl font-bold text-[#0b2545]">{t("formTitle")}</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>{label(t("fullName"))}<FormControl><Input placeholder={t("fullNamePh")} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>{label(t("company"))}<FormControl><Input placeholder={t("companyPh")} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="jobTitle" render={({ field }) => (
                    <FormItem>{label(t("jobTitle"), false)}<FormControl><Input placeholder={t("jobTitlePh")} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      {label(t("mobile"))}
                      <div dir="ltr" className="flex">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm">+20</span>
                        <FormControl><Input inputMode="tel" className="rounded-l-none" placeholder={t("mobilePh")} {...field} /></FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>{label(t("email"))}<FormControl><Input type="email" dir="ltr" placeholder={t("emailPh")} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="supportType" render={({ field }) => (
                    <FormItem>
                      {label(t("supportType"))}
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder={t("supportTypePh")} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {supportTypes.map((type) => <SelectItem key={type} value={type}>{t(`types.${type}.title`)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                      {label(t("priority"))}
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder={t("priorityPh")} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {supportPriorities.map((p) => <SelectItem key={p} value={p}>{t(`priorities.${p}`)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="branch" render={({ field }) => (
                    <FormItem>{label(t("branch"))}<FormControl><Input placeholder={t("branchPh")} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="details" render={({ field }) => (
                  <FormItem>{label(t("details"))}<FormControl><Textarea rows={4} placeholder={t("detailsPh")} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex items-center gap-2 rounded-md bg-[#f26522] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d9541a] disabled:opacity-60"
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rtl:-scale-x-100" />}
                    {isSending ? t("sending") : t("send")}
                  </button>
                </div>
              </form>
            </Form>
          </div>
          {sidebar}
        </div>
      </section>
    </>
  )
}
