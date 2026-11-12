import Link from "next/link"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Headphones,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
} from "lucide-react"
import { db } from "@/db"
import { getTenantId } from "@/lib/tenant"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SupportHubRequest from "@/components/support/support-hub-request"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "supportHub" })
  return { title: `${t("nav")} | PrimeServe`, description: t("heroText") }
}

export default async function SupportHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [storeId, t] = await Promise.all([
    getTenantId(),
    getTranslations({ locale, namespace: "supportHub" }),
  ])
  const contactInfo = await db.query.contactInformation.findFirst({
    where: (contactInformation, { eq }) => eq(contactInformation.storeId, storeId),
    columns: { customerServicePhone: true, supportEmail: true },
  })
  const phone = contactInfo?.customerServicePhone?.trim() || null
  const email = contactInfo?.supportEmail?.trim() || null
  const waDigits = phone ? phone.replace(/[^0-9]/g, "").replace(/^0/, "20") : null
  const contactHref = `/${locale}/contact`

  const fastChannels = [
    { icon: Phone, color: "bg-emerald-50 text-emerald-700", valueColor: "text-emerald-700", title: t("callTitle"), text: t("callText"), value: phone, href: phone ? `tel:${phone.replace(/\s/g, "")}` : contactHref },
    { icon: MessageCircle, color: "bg-emerald-50 text-emerald-600", valueColor: "text-emerald-700", title: t("whatsappTitle"), text: t("whatsappText"), value: phone, href: waDigits ? `https://wa.me/${waDigits}` : contactHref },
    { icon: Mail, color: "bg-orange-50 text-[#f26522]", valueColor: "text-[#f26522]", title: t("emailTitle"), text: t("emailText"), value: email, href: email ? `mailto:${email}` : contactHref },
  ]

  const steps = [
    { key: "s1", icon: Send, color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
    { key: "s2", icon: Users, color: "border-orange-200 bg-orange-50 text-[#f26522]" },
    { key: "s3", icon: Headphones, color: "border-blue-200 bg-blue-50 text-[#0b2545]" },
    { key: "s4", icon: ShieldCheck, color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
    { key: "s5", icon: Star, color: "border-orange-200 bg-orange-50 text-[#f26522]" },
  ]

  const promises = [
    { key: "p1", icon: ShieldCheck, color: "bg-slate-100 text-[#0b2545]" },
    { key: "p2", icon: UserCheck, color: "bg-emerald-50 text-emerald-700" },
    { key: "p3", icon: BarChart3, color: "bg-blue-50 text-[#1e3a8a]" },
  ]

  const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"]

  const sidebar = (
    <aside className="rounded-xl border bg-slate-50 p-6">
      <h2 className="mb-4 text-xl font-bold text-[#0b2545]">{t("fasterTitle")}</h2>
      <div className="space-y-3">
        {fastChannels.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.href.startsWith("https://") ? "_blank" : undefined}
            rel={c.href.startsWith("https://") ? "noopener noreferrer" : undefined}
            className="flex gap-4 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${c.color}`}>
              <c.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-[#0b2545]">{c.title}</p>
              <p className="text-sm text-muted-foreground">{c.text}</p>
              <p dir="ltr" className={`mt-1 text-sm font-semibold ${c.valueColor} rtl:text-right`}>
                {c.value ?? t("viaContactPage")}
              </p>
            </div>
          </a>
        ))}
      </div>
    </aside>
  )

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute hidden lg:block ltr:-left-24 rtl:-right-24 top-1/3 h-56 w-56 rounded-full border-[40px] border-slate-200/70" />
        <div className="pointer-events-none absolute hidden lg:block ltr:-right-24 rtl:-left-24 -top-24 h-72 w-72 rounded-full border-[48px] border-[#0b2545]" />
        <div className="container relative mx-auto grid items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-2 lg:py-20">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0b2545] md:text-5xl">{t("heroTitle")}</h1>
            <p className="max-w-xl text-lg text-slate-600">{t("heroText")}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#request" className="inline-flex items-center gap-2 rounded-md bg-[#f26522] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#d9541a]">
                {t("heroPrimary")} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </a>
              <Link href={contactHref} className="inline-flex items-center gap-2 rounded-md border-2 border-[#0b2545] px-6 py-3 font-semibold text-[#0b2545] transition-colors hover:bg-[#0b2545] hover:text-white">
                {t("heroSecondary")} <Phone className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative mx-auto flex h-80 w-full max-w-md items-center justify-center">
            <div className="flex h-60 w-60 items-center justify-center rounded-full bg-gradient-to-br from-[#0b2545] to-[#1e3a8a] shadow-2xl">
              <Headphones className="h-28 w-28 text-white" strokeWidth={1.5} />
            </div>
            <div className="absolute left-0 top-4 flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-[#0b2545]">{t("badgeHelpTitle")}</p>
                <p className="text-xs text-muted-foreground">{t("badgeHelpText")}</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-0 flex max-w-[220px] items-center gap-3 rounded-xl bg-white p-4 shadow-lg">
              <Heart className="h-8 w-8 shrink-0 text-[#f26522]" />
              <div>
                <p className="text-sm font-bold text-[#0b2545]">{t("badgeMattersTitle")}</p>
                <p className="text-xs text-muted-foreground">{t("badgeMattersText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SupportHubRequest sidebar={sidebar} />

      {/* Tracking steps */}
      <section className="container mx-auto px-4 md:px-6 pb-12">
        <div className="grid gap-8 rounded-xl border bg-slate-50 p-6 md:p-8 lg:grid-cols-4">
          <div>
            <h2 className="mb-3 text-xl font-bold text-[#0b2545]">{t("trackTitle")}</h2>
            <p className="text-sm text-slate-600">{t("trackText")}</p>
          </div>
          <ol className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5 lg:col-span-3">
            {steps.map((s, i) => (
              <li key={s.key} className="flex flex-col items-center text-center">
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-[#0b2545]">{i + 1}. {t(`steps.${s.key}.title`)}</p>
                <p className="text-xs text-muted-foreground">{t(`steps.${s.key}.text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Promise */}
      <section className="container mx-auto px-4 md:px-6 pb-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-[#0b2545]">{t("promiseTitle")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {promises.map((p) => (
            <div key={p.key} className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${p.color}`}>
                <p.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="font-bold text-[#0b2545]">{t(`promises.${p.key}.title`)}</p>
                <p className="text-sm text-muted-foreground">{t(`promises.${p.key}.text`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 md:px-6 pb-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-[#0b2545]">{t("faqTitle")}</h2>
        <div className="grid gap-x-6 md:grid-cols-2">
          {[faqKeys.slice(0, 3), faqKeys.slice(3)].map((col, ci) => (
            <Accordion key={ci} type="single" collapsible className="rounded-xl border bg-white px-4">
              {col.map((k) => (
                <AccordionItem key={k} value={k}>
                  <AccordionTrigger className="text-start text-sm font-semibold text-[#0b2545]">{t(`faqs.${k}.q`)}</AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600">{t(`faqs.${k}.a`)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-[#0b2545] p-8 md:p-12">
          <div className="pointer-events-none absolute hidden md:block -bottom-32 ltr:-right-16 rtl:-left-16 h-72 w-72 rounded-full border-[48px] border-[#f26522]" />
          <div className="pointer-events-none absolute hidden md:block -bottom-24 ltr:right-40 rtl:left-40 h-40 w-40 rounded-full bg-emerald-700/80" />
          <div className="relative max-w-xl space-y-4">
            <h2 className="text-2xl font-bold text-white md:text-3xl">{t("ctaTitle")}</h2>
            <p className="text-white/80">{t("ctaText")}</p>
            <a href="#request" className="inline-flex items-center gap-2 rounded-md bg-[#f26522] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#d9541a]">
              {t("ctaButton")} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
