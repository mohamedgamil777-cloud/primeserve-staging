// Phone-only layout of the Employee Experience page (shown below the md breakpoint).
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import {
  ArrowRight, Award, Building2, CalendarDays, Check, GraduationCap, Hourglass, Layers, MessageCircleMore,
  MessagesSquare, Settings, ShieldCheck, Star, TrendingUp, User, Users, Zap,
} from "lucide-react"
import { HomeScreen, PhoneFrame } from "./phone-mockups"
import { DashboardMockup } from "./dashboard-mockup"
import { SixExperiencesBanner } from "./sections"

const svc = (f: string) => `/imgs/services/${f}`
const rows = [
  { icon: User, img: svc("890e72bb-cfd6-4a3b-8317-db82c9ca2332-ai01.webp"), tone: "teal" },
  { icon: Building2, img: svc("d71dc543-df65-425b-9fba-6045ba344a71-9921.webp"), tone: "orange" },
  { icon: MessageCircleMore, img: svc("0c9009df-2e5a-40fd-a4e6-917394c06a14-ai01.webp"), tone: "teal" },
  { icon: GraduationCap, img: svc("be7c5175-9669-4653-bbd6-a68238fcc101-ai01.webp"), tone: "orange" },
  { icon: Star, img: svc("32f531cf-dffc-4f16-9e00-c97e8a1eedf3-ai01.webp"), tone: "teal" },
  { icon: CalendarDays, img: svc("a3aaa2b0-371a-4a99-9ede-143c07525cf2-ai01.webp"), tone: "orange" },
] as const
const benefits = [
  { icon: Hourglass, tone: "teal" },
  { icon: Layers, tone: "teal" },
  { icon: Users, tone: "teal" },
  { icon: Zap, tone: "orange" },
  { icon: ShieldCheck, tone: "orange" },
  { icon: TrendingUp, tone: "teal" },
] as const
const soft = (tone: string) => (tone === "teal" ? "bg-brand-green-soft text-brand-teal" : "bg-brand-orange-soft text-brand-orange")
const ink = (tone: string) => (tone === "teal" ? "text-brand-teal" : "text-brand-orange")

export async function MobileEmployeeExperience({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "eePage.mobile" })
  const tp = await getTranslations({ locale, namespace: "eePage.pillars" })
  const demoHref = `/${locale}/support`
  const connect = [Settings, MessagesSquare, Users]

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-8 pt-8">
        <span aria-hidden className="pointer-events-none absolute -end-16 top-6 h-56 w-40 rotate-[25deg] rounded-[3rem] bg-brand-orange/85" />
        <span aria-hidden className="pointer-events-none absolute -end-24 bottom-10 h-48 w-48 rounded-full bg-brand-green-soft" />
        <div className="relative grid grid-cols-[1.15fr_1fr] items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-navy">
              <span className="h-0.5 w-6 bg-brand-orange" />
              {t("eyebrow")}
            </div>
            <h1 className="mt-3 text-[1.7rem] font-extrabold leading-[1.1] tracking-tight text-brand-navy min-[400px]:text-3xl">
              {t("title1")} <span className="text-brand-orange">{t("title2")}</span>
            </h1>
          </div>
          <PhoneFrame className="w-full max-w-[190px] justify-self-end">
            <HomeScreen color="#00796B" company="PrimeServe" logoSrc="/imgs/about/mark.png" />
          </PhoneFrame>
        </div>
        <p className="relative mt-5 text-base leading-relaxed text-brand-navy-2">{t("text")}</p>
        <div className="relative mt-5 flex flex-col gap-3">
          <a href="#platform-m" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-orange font-semibold text-white shadow-sm">
            {t("explore")}<ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </a>
          <Link href={demoHref} className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-brand-navy font-semibold text-brand-navy">
            {t("demo")}
          </Link>
        </div>
      </section>

      {/* Connected workplace */}
      <section className="px-4 pb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy">{t("connectTitle")}</h2>
        <div className="mt-4 grid grid-cols-3 rounded-2xl border border-brand-teal/10 bg-brand-green-soft py-4">
          {connect.map((Icon, i) => (
            <div key={i} className="flex flex-col items-center gap-2 border-s border-brand-teal/15 px-2 text-center first:border-s-0">
              <Icon className="h-8 w-8 text-brand-teal" strokeWidth={1.6} />
              <span className="text-[13px] font-semibold leading-snug text-brand-navy">{t(`connect${i + 1}`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Six modules */}
      <section id="platform-m" className="scroll-mt-20 px-4 pb-8">
        <SixExperiencesBanner
          compact
          eyebrow={tp("eyebrow")}
          titleA={tp("titleA")}
          titleB={tp("titleB")}
          text={t("platformText")}
          items={rows.map((r, i) => ({ icon: r.icon, label: t(`r${i + 1}t`) }))}
        />
        <div className="mt-4 space-y-3">
          {rows.map((r, i) => (
            <Link key={i} href={demoHref} className="flex items-center overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
              <img src={r.img} alt="" loading="lazy" className="h-[72px] w-[84px] shrink-0 object-cover" />
              <span className={`-ms-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-4 ring-white ${soft(r.tone)}`}>
                <r.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="ms-3 min-w-0 flex-1 border-s border-brand-border py-2 ps-3">
                <span className="block font-bold leading-tight text-brand-navy">{t(`r${i + 1}t`)}</span>
                <span className="mt-0.5 block text-xs leading-snug text-brand-navy-2/80">{t(`r${i + 1}x`)}</span>
              </span>
              <span className="mx-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green-soft text-brand-teal">
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Management */}
      <section className="px-4 pb-6">
        <div className="overflow-hidden rounded-2xl bg-brand-gray p-5">
          <h2 className="border-s-4 border-brand-orange ps-3 text-2xl font-extrabold leading-tight text-brand-navy">{t("mgmtTitle")}</h2>
          <p className="mt-3 text-sm text-brand-navy-2">{t("mgmtText")}</p>
          <ul className="mt-3 space-y-1.5">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex items-center gap-2 text-sm text-brand-navy"><Check className="h-4 w-4 text-brand-teal" strokeWidth={3} />{t(`mgmt${n}`)}</li>
            ))}
          </ul>
          <div className="mt-5" dir="ltr"><DashboardMockup /></div>
        </div>
      </section>

      {/* White label */}
      <section className="px-4 pb-8">
        <div className="flex items-center gap-4 rounded-2xl bg-brand-green-soft p-5">
          <div className="relative h-24 w-24 shrink-0">
            <span className="absolute start-0 top-3 h-20 w-20 -rotate-12 rounded-2xl bg-brand-teal" />
            <span className="absolute start-2 top-1 h-20 w-20 -rotate-6 rounded-2xl bg-brand-orange" />
            <span className="absolute start-4 top-0 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 shadow-md">
              <img src="/imgs/about/mark.png" alt="PrimeServe" className="h-full w-full object-contain" />
            </span>
          </div>
          <div className="min-w-0 border-s border-brand-teal/20 ps-4">
            <h2 className="text-xl font-extrabold text-brand-navy">{t("wlTitle")}</h2>
            <p className="mt-1 text-sm text-brand-navy-2">{t("wlText")}</p>
            <ul className="mt-2 space-y-1">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm text-brand-navy"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" strokeWidth={3} />{t(`wl${n}`)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 pb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy">{t("benTitle")}</h2>
        <p className="mt-1 text-sm text-brand-navy-2/80">{t("benText")}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <div key={i} className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
              <b.icon className={`h-7 w-7 ${ink(b.tone)}`} strokeWidth={1.7} />
              <div className="mt-2 font-bold leading-tight text-brand-navy">{t(`b${i + 1}t`)}</div>
              <div className="mt-1 text-xs leading-snug text-brand-navy-2/80">{t(`b${i + 1}x`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-10">
        <div className="relative overflow-hidden rounded-2xl bg-brand-navy p-6">
          <span aria-hidden className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-brand-teal/40" />
          <div className="relative border-s-4 border-brand-orange ps-4">
            <h2 className="text-xl font-extrabold leading-tight text-white">{t("ctaTitle")}</h2>
            <p className="mt-2 text-sm text-white/80">{t("ctaText")}</p>
          </div>
          <Link href={demoHref} className="relative mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-orange font-semibold text-white">
            {t("demo")}<ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  )
}
