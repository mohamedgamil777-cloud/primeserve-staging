import Link from "next/link"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import {
  ArrowRight, BookOpen, Building2, CalendarHeart, Check, Gauge, Laptop, Layers, Megaphone,
  MessageCircle, Palette, Rocket, ShieldCheck, Smartphone, Smile, Sparkles, Star, Timer, Trophy, Users, Wrench, Database,
} from "lucide-react"
import { AttendanceScreen, HomeScreen, LeaveScreen, PhoneFrame } from "@/components/employee-experience/phone-mockups"
import { DashboardMockup } from "@/components/employee-experience/dashboard-mockup"
import { CheckItem, FeatureCard, PillarCard, SectionHeading, Eyebrow } from "@/components/employee-experience/sections"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "eePage" })
  return { title: `${t("metaTitle")} | PrimeServe`, description: t("hero.text") }
}

const primaryBtn = "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F26522] px-6 font-semibold text-white shadow-[0_8px_20px_-8px_rgba(242,101,34,0.7)] transition-colors hover:bg-[#d9541a]"
const outlineBtn = "inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#0B1F33] bg-white px-6 font-semibold text-[#0B1F33] transition-colors hover:bg-[#0B1F33] hover:text-white"

export default async function EmployeeExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "eePage" })
  const demoHref = `/${locale}/support`

  const connect = [
    { icon: Users, tone: "teal" as const, n: 1 },
    { icon: Layers, tone: "teal" as const, n: 2 },
    { icon: MessageCircle, tone: "blue" as const, n: 3 },
    { icon: Star, tone: "orange" as const, n: 4 },
  ]
  const pillars = [
    { icon: Timer, tone: "teal" as const, image: "leave" },
    { icon: Wrench, tone: "orange" as const, image: "facility" },
    { icon: Megaphone, tone: "blue" as const, image: "posts" },
    { icon: BookOpen, tone: "teal" as const, image: "kpi" },
    { icon: Trophy, tone: "orange" as const, image: "profile" },
    { icon: CalendarHeart, tone: "blue" as const, image: "dashboard" },
  ]
  const benefits = [
    { icon: Timer, tone: "teal" as const },
    { icon: Database, tone: "blue" as const },
    { icon: Smile, tone: "orange" as const },
    { icon: Gauge, tone: "teal" as const },
    { icon: ShieldCheck, tone: "blue" as const },
    { icon: Rocket, tone: "orange" as const },
  ]
  const brands = [
    { color: "#0B6E69", name: t("m.brandA"), logo: "N" },
    { color: "#1D4ED8", name: t("m.brandB"), logo: "D" },
    { color: "#B45309", name: t("m.brandC"), logo: "Y" },
  ]

  return (
    <main className="flex flex-col overflow-x-hidden bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F8F9] to-white">
        <div className="pointer-events-none absolute -top-40 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-[#7DD3C8]/50 to-[#0B6E69]/10 blur-2xl ltr:-right-40 rtl:-left-40" />
        <div className="pointer-events-none absolute bottom-[-10rem] h-[22rem] w-[22rem] rounded-full bg-[#F26522]/15 blur-3xl ltr:right-[10%] rtl:left-[10%]" />
        <div className="container relative mx-auto grid items-center gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1fr_1.25fr] lg:py-16">
          <div className="space-y-6 text-center lg:text-start">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0B1F33] sm:text-5xl xl:text-[3.5rem]">
              {t("hero.title1")}{" "}
              <span className="block">
                {t("hero.title2")}{" "}
                <span className="bg-gradient-to-r from-[#00796B] to-[#0EA5A4] bg-clip-text text-transparent">{t("hero.title3")}</span>
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-base text-[#475467] sm:text-lg lg:mx-0">{t("hero.text")}</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <a href="#platform" className={primaryBtn}>{t("hero.explore")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></a>
              <Link href={demoHref} className={outlineBtn}>{t("hero.demo")}</Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-sm font-medium text-[#0B1F33] lg:justify-start">
              <span className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-[#00796B]" />{t("hero.tagMobile")}</span>
              <span className="hidden h-5 w-px bg-[#D0D5DD] sm:block" />
              <span className="flex items-center gap-2"><Laptop className="h-5 w-5 text-[#00796B]" />{t("hero.tagManagement")}</span>
            </div>
          </div>

          {/* Device composition: three phones in front of the management dashboard */}
          <div className="relative mx-auto aspect-[10/8.4] w-full max-w-[720px] lg:aspect-[10/7]" dir="ltr">
            <div className="absolute right-[-3%] top-[8%] hidden w-[58%] lg:block">
              <DashboardMockup />
            </div>
            <PhoneFrame className="absolute left-[2%] top-[14%] z-10 w-[33%] -rotate-6 lg:left-[0%] lg:top-[15%] lg:w-[24%]">
              <AttendanceScreen />
            </PhoneFrame>
            <PhoneFrame className="absolute left-[31%] top-0 z-20 w-[38%] lg:left-[19%] lg:w-[28%]">
              <HomeScreen />
            </PhoneFrame>
            <PhoneFrame className="absolute right-[2%] top-[12%] z-10 w-[33%] rotate-6 lg:left-[42%] lg:right-auto lg:top-[13%] lg:w-[24%]">
              <LeaveScreen />
            </PhoneFrame>
          </div>
        </div>
      </section>

      {/* Connect cards */}
      <section className="container mx-auto px-4 py-14 md:px-6 md:py-20">
        <SectionHeading title={t("connect.title")} center />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {connect.map((c) => (
            <FeatureCard key={c.n} icon={c.icon} tone={c.tone} title={t(`connect.c${c.n}t`)} text={t(`connect.c${c.n}x`)} />
          ))}
        </div>
      </section>

      {/* Six pillars */}
      <section id="platform" className="scroll-mt-24 bg-[#F8FAFC] py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading eyebrow={t("pillars.eyebrow")} title={t("pillars.title")} text={t("pillars.text")} center />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => {
              const n = i + 1
              return (
                <PillarCard
                  key={n}
                  index={n}
                  icon={p.icon}
                  tone={p.tone}
                  image={`/imgs/employee-experience/${p.image}.webp`}
                  title={t(`pillars.p${n}t`)}
                  text={t(`pillars.p${n}x`)}
                  bullets={[t(`pillars.p${n}b1`), t(`pillars.p${n}b2`), t(`pillars.p${n}b3`)]}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Management experience */}
      <section className="container mx-auto grid items-center gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <SectionHeading eyebrow={t("management.eyebrow")} title={t("management.title")} text={t("management.text")} />
          <ul className="space-y-3">
            {[1, 2, 3, 4].map((n) => <CheckItem key={n}>{t(`management.b${n}`)}</CheckItem>)}
          </ul>
          <Link href={demoHref} className={primaryBtn}>{t("hero.demo")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </div>
        <div className="relative" dir="ltr">
          <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#E8F5F3] to-[#EAF2FF]" />
          <DashboardMockup className="relative" />
          <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-[0_12px_30px_-10px_rgba(11,31,51,0.3)] sm:left-8" dir={locale === "ar" ? "rtl" : "ltr"}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00796B] text-white"><Check className="h-5 w-5" strokeWidth={3} /></span>
            <div className="leading-tight">
              <div className="text-sm font-bold text-[#0B1F33]">{t("management.toastTitle")}</div>
              <div className="text-xs text-[#667085]">{t("management.toastText")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* White-label */}
      <section className="relative overflow-hidden bg-[#0B1F33] py-14 text-white md:py-20">
        <div className="pointer-events-none absolute -top-32 h-96 w-96 rounded-full bg-[#00796B]/30 blur-3xl ltr:-left-32 rtl:-right-32" />
        <div className="pointer-events-none absolute -bottom-32 h-80 w-80 rounded-full bg-[#F26522]/20 blur-3xl ltr:right-0 rtl:left-0" />
        <div className="container relative mx-auto grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Eyebrow>{t("whiteLabel.eyebrow")}</Eyebrow>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("whiteLabel.title")}</h2>
            <p className="text-base text-white/75 sm:text-lg">{t("whiteLabel.text")}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => <CheckItem key={n} light>{t(`whiteLabel.b${n}`)}</CheckItem>)}
            </ul>
            <div className="flex items-center gap-3 pt-2">
              <Palette className="h-5 w-5 text-[#F26522]" />
              {brands.map((b) => <span key={b.color} className="h-7 w-7 rounded-full ring-2 ring-white/30" style={{ background: b.color }} />)}
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[560px] items-end justify-center gap-[4%]">
            {brands.map((b, i) => (
              <PhoneFrame key={b.color} className={i === 1 ? "w-[34%]" : "mb-[4%] w-[29%]"}>
                <HomeScreen color={b.color} company={b.name} logo={b.logo} />
              </PhoneFrame>
            ))}
          </div>
        </div>
      </section>

      {/* Business benefits */}
      <section className="container mx-auto px-4 py-14 md:px-6 md:py-20">
        <SectionHeading eyebrow={t("benefits.eyebrow")} title={t("benefits.title")} center />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <FeatureCard key={i} icon={b.icon} tone={b.tone} title={t(`benefits.b${i + 1}t`)} text={t(`benefits.b${i + 1}x`)} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 pb-16 md:px-6 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1F33] via-[#0B3B4A] to-[#0B6E69] px-6 py-12 text-center text-white md:px-16 md:py-16">
          <div className="pointer-events-none absolute -top-20 h-64 w-64 rounded-full bg-[#F26522]/25 blur-2xl ltr:-right-16 rtl:-left-16" />
          <div className="relative mx-auto max-w-2xl space-y-5">
            <Sparkles className="mx-auto h-8 w-8 text-[#F26522]" />
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("cta.title")}</h2>
            <p className="text-white/80 sm:text-lg">{t("cta.text")}</p>
            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <Link href={demoHref} className={primaryBtn}>{t("cta.demo")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
              <Link href={`/${locale}/contact`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white px-6 font-semibold text-white transition-colors hover:bg-white hover:text-[#0B1F33]">
                <Building2 className="h-4 w-4" />{t("cta.contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
