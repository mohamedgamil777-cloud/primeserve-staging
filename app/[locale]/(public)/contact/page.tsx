import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArrowRight, ArrowUpRight, Headphones, Mail, MessageCircle, Phone, ShieldCheck, Users, Zap } from "lucide-react"
import { db } from "@/db"
import { getTenantId } from "@/lib/tenant"
import ContactMessageForm from "@/components/contact/contact-message-form"
import building from "@/public/imgs/banners/contact-building.webp"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "contactPage" })
  return { title: `${t("badge")} | PrimeServe`, description: t("subtitle") }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [storeId, t] = await Promise.all([
    getTenantId(),
    getTranslations({ locale, namespace: "contactPage" }),
  ])
  const contactInfo = await db.query.contactInformation.findFirst({
    where: (contactInformation, { eq }) => eq(contactInformation.storeId, storeId),
    columns: { customerServicePhone: true, supportEmail: true },
  })
  const phone = contactInfo?.customerServicePhone?.trim() || null
  const email = contactInfo?.supportEmail?.trim() || null
  const waDigits = phone ? phone.replace(/[^0-9]/g, "").replace(/^0/, "20") : null
  const supportHref = `/${locale}/support`

  const highlights = [
    { icon: Zap, label: t("fast"), ring: "border-[#F26522]/60 text-[#F26522]" },
    { icon: ShieldCheck, label: t("reliable"), ring: "border-[#00796B]/70 text-[#2BB3A3]" },
    { icon: Users, label: t("team"), ring: "border-[#00796B]/70 text-[#2BB3A3]" },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B1F33]">
        <div className="absolute inset-y-0 hidden w-[55%] md:block ltr:right-0 rtl:left-0 rtl:-scale-x-100">
          <Image src={building} alt="" fill priority sizes="55vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F33] via-[#0B1F33]/40 to-transparent" />
        </div>
        <div className="container relative mx-auto px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-2xl space-y-5">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">{t("badge")}</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {t("titleStart")} <span className="text-[#F26522]">{t("titleBrand")}</span>
            </h1>
            <p className="max-w-xl text-lg text-white/85">{t("subtitle")}</p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {highlights.map((h, i) => (
                <li key={h.label} className="flex items-center gap-3">
                  {i > 0 && <span className="hidden h-10 w-px bg-white/20 sm:block ltr:-ml-3 rtl:-mr-3" />}
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-white/5 ${h.ring}`}>
                    <h.icon className="h-5 w-5" />
                  </span>
                  <span className="font-semibold text-white">{h.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Form and channels */}
      <section className="container mx-auto grid gap-8 px-4 py-12 md:px-6 lg:grid-cols-2">
        <ContactMessageForm />

        <div className="space-y-4">
          <h2 className="mb-2 text-2xl font-bold text-[#0B1F33] md:text-3xl">{t("otherTitle")}</h2>

          <ChannelCard
            icon={Phone} iconClass="bg-[#E8F5F3] text-[#00796B]"
            title={t("csTitle")} text={t("csText")}
            action={phone
              ? <a dir="ltr" href={`tel:${phone.replace(/\s/g, "")}`} className="font-bold text-[#F26522] hover:underline">{phone}</a>
              : <span className="text-sm font-semibold text-[#667085]">{t("notSet")}</span>}
          />
          <ChannelCard
            icon={Mail} iconClass="bg-[#FFF3EC] text-[#F26522]"
            title={t("emailTitle")} text={t("emailText")}
            action={email
              ? <a href={`mailto:${email}`} className="break-all font-bold text-[#F26522] hover:underline">{email}</a>
              : <span className="text-sm font-semibold text-[#667085]">{t("notSet")}</span>}
          />
          <ChannelCard
            icon={MessageCircle} iconClass="bg-[#E8F5F3] text-[#00796B]"
            title={t("waTitle")} text={t("waText")}
            action={waDigits
              ? <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#F26522] px-4 py-2 font-semibold text-[#F26522] transition-colors hover:bg-[#FFF3EC]">{t("waButton")} <ArrowUpRight className="h-4 w-4" /></a>
              : <span className="text-sm font-semibold text-[#667085]">{t("notSet")}</span>}
          />

          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-[#EAF2FF] p-6 sm:flex-row sm:items-center">
            <Headphones className="h-10 w-10 shrink-0 text-[#0B1F33]" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-xl font-bold text-[#0B1F33]">{t("quickTitle")}</p>
              <p className="text-sm text-[#667085]">{t("quickText")}</p>
            </div>
            <Link href={supportHref} className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border-2 border-[#0B1F33] px-4 py-2 font-semibold text-[#0B1F33] transition-colors hover:bg-[#0B1F33] hover:text-white">
              {t("quickButton")} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function ChannelCard({ icon: Icon, iconClass, title, text, action }: {
  icon: React.ElementType; iconClass: string; title: string; text: string; action: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="flex-1">
        <p className="text-lg font-bold text-[#0B1F33]">{title}</p>
        <p className="text-sm text-[#667085]">{text}</p>
      </div>
      <div className="sm:border-s sm:ps-5">{action}</div>
    </div>
  )
}
