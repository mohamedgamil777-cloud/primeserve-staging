import { localizeContent } from "@/lib/content-ar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Clock, Users, Award, Target, Eye, ArrowRight, Box, ShoppingCart, Settings, Zap, Layers, Leaf, ShieldCheck, Lightbulb, LayoutGrid, Laptop, Truck, Check, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { getTenantId } from "@/lib/tenant"
import { db } from "@/db"
import { genStoreTeamMemberImageUrl } from "@/lib/store"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const dynamic = 'force-dynamic';




export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({"locale":(await params).locale})
  const storeId = await getTenantId()
  const storeInfo = await db.query.stores.findFirst({
    "where":(stores,{eq})=>eq(stores.id,storeId),
    "columns":{
      "name":true,
      "description":true
    },
  })
  return {
    title: `${t('about-our-store')} | ${storeInfo?.name}`,
    description: storeInfo?.description,
  };
}


export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const tu = await getTranslations({ locale: (await params).locale, namespace: "ui" })
  const t = await getTranslations({"locale":(await params).locale})
  const storeId = await getTenantId()
  const storeInfo = await db.query.stores.findFirst({
    "where":(stores,{eq})=>eq(stores.id,storeId),
    "columns":{
      "id":true
    },
    "with":{
      "aboutPageContent":{
        "columns":{
          "happyCustomers":true,
          "heroDescription":true,
          "yearsInBusiness":true,
          "heroTitle":true,
          "mission":true,
          "values":true,
          "productsAvailable":true,
          "vision":true,
        }
      },
      "teamMembers":{
        "columns":{
          "name":true,
          "bio":true,
          "role":true,
          "image":true
        }
      },
      "contactInformation":{
        "columns":{
          "supportEmail":true,
          "customerServicePhone":true
        }
      }
    }
  })
  const branches = [
    {
      id: 1,
      name: "Downtown Flagship Store",
      address: "123 Main Street, Downtown, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "downtown@store.com",
      hours: {
        "Monday - Friday": "9:00 AM - 9:00 PM",
        Saturday: "9:00 AM - 10:00 PM",
        Sunday: "10:00 AM - 8:00 PM",
      },
      manager: "Sarah Johnson",
      established: "2018",
      features: ["Personal Shopping", "Gift Wrapping", "Alterations", "VIP Lounge"],
    },
    {
      id: 2,
      name: "Westside Mall Location",
      address: "456 Shopping Center Blvd, Westside, NY 10002",
      phone: "+1 (555) 234-5678",
      email: "westside@store.com",
      hours: {
        "Monday - Saturday": "10:00 AM - 9:00 PM",
        Sunday: "11:00 AM - 7:00 PM",
      },
      manager: "Michael Chen",
      established: "2020",
      features: ["Express Pickup", "Kids Play Area", "Café Corner"],
    },
    {
      id: 3,
      name: "Eastside Outlet",
      address: "789 Outlet Drive, Eastside, NY 10003",
      phone: "+1 (555) 345-6789",
      email: "eastside@store.com",
      hours: {
        "Monday - Friday": "10:00 AM - 8:00 PM",
        "Saturday - Sunday": "9:00 AM - 9:00 PM",
      },
      manager: "Emily Rodriguez",
      established: "2021",
      features: ["Outlet Prices", "Bulk Shopping", "Business Accounts"],
    },
  ]

  const locale = (await params).locale
  const ta = await getTranslations({ locale, namespace: "aboutPage" })

  const stats = [
    { icon: Users, v: "st1v", l: "st1l" },
    { icon: Box, v: "st2v", l: "st2l" },
    { icon: LayoutGrid, v: "st3v", l: "st3l" },
    { icon: Layers, v: "st4v", l: "st4l" },
  ]
  const solutions = [
    { icon: ShoppingCart, tone: "teal" as const, t: "c1t", x: "c1x", href: `/${locale}/categories` },
    { icon: Settings, tone: "orange" as const, t: "c2t", x: "c2x", href: `/${locale}/services` },
    { icon: Users, tone: "teal" as const, t: "c3t", x: "c3x", href: `/${locale}/employee-experience` },
  ]
  const steps = [Target, Layers, Laptop, Truck]
  const values = [
    { icon: Zap, tone: "orange" as const },
    { icon: Award, tone: "teal" as const },
    { icon: Layers, tone: "orange" as const },
    { icon: Leaf, tone: "teal" as const },
    { icon: ShieldCheck, tone: "orange" as const },
    { icon: Lightbulb, tone: "teal" as const },
  ]
  const toneText = (tone: "teal" | "orange") => (tone === "teal" ? "text-brand-teal" : "text-brand-orange")

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden sm:h-64 lg:h-80">
        <img src="/imgs/banners/contact-building.webp" alt="" className="h-full w-full object-cover" />
      </div>

      {/* Intro */}
      <section className="relative overflow-hidden">
        <img src="/imgs/about/mark.png" alt="" aria-hidden className="pointer-events-none absolute end-10 top-6 hidden w-56 opacity-[0.08] grayscale lg:block" />
        <div className="container relative mx-auto px-4 py-10 md:px-6 md:py-12">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-teal sm:text-sm">
            <span className="h-0.5 w-10 bg-brand-orange" />
            {ta("eyebrow")}
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-navy md:text-5xl xl:text-6xl">
            {ta("h1a")}<br /><span className="text-brand-orange">{ta("h1b")}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-navy-2">{ta("heroText")}</p>
        </div>
      </section>

      {/* At a glance */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 items-center gap-6 rounded-2xl border border-brand-teal/10 bg-brand-green-soft p-6 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:gap-0 lg:py-7">
          <div className="col-span-2 lg:col-span-1 lg:pe-6">
            <span className="block h-0.5 w-10 bg-brand-orange" />
            <h2 className="mt-3 text-2xl font-extrabold leading-tight text-brand-navy sm:text-3xl">{ta("glance")}</h2>
          </div>
          {stats.map((st, i) => (
            <div key={i} className="text-center lg:border-s lg:border-brand-teal/15">
              <st.icon className="mx-auto h-8 w-8 text-brand-teal" strokeWidth={1.6} />
              <div className="mt-2 text-3xl font-extrabold text-brand-navy" dir="ltr">{ta(st.v)}</div>
              <div className="mt-1 text-sm text-brand-navy-2/80">{ta(st.l)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What makes us different */}
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-14">
        <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{ta("solTitle")}</h2>
        <p className="mt-2 text-brand-navy-2/80">{ta("solText")}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {solutions.map((c, i) => (
            <Link key={i} href={c.href} className={`group flex h-full gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${c.tone === "teal" ? "border-brand-teal/10 bg-brand-green-soft" : "border-brand-orange/10 bg-brand-orange-soft"}`}>
              <c.icon className={`h-10 w-10 shrink-0 ${toneText(c.tone)}`} strokeWidth={1.5} />
              <div className="flex flex-1 flex-col">
                <h3 className="text-lg font-bold text-brand-navy">{ta(c.t)}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-brand-navy-2/85">{ta(c.x)}</p>
                <ArrowRight className={`mt-3 h-5 w-5 self-end transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 ${toneText(c.tone)}`} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 rounded-2xl border border-brand-border bg-brand-gray p-6 sm:p-8 lg:grid-cols-[0.9fr_2.6fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">{ta("howTitle")}</h2>
            <span className="mt-3 block h-0.5 w-10 bg-brand-orange" />
            <p className="mt-3 text-brand-navy-2/85">{ta("howText")}</p>
          </div>
          <ol className="relative grid grid-cols-2 gap-y-8 sm:grid-cols-4">
            <span aria-hidden className="absolute inset-x-[12%] top-8 hidden h-px bg-brand-teal/25 sm:block" />
            {steps.map((Icon, i) => (
              <li key={i} className="relative flex flex-col items-center px-2 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-soft text-brand-teal ring-8 ring-brand-gray">
                  <Icon className="h-8 w-8" strokeWidth={1.6} />
                </span>
                <span className="-mt-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white ring-4 ring-brand-gray">{i + 1}</span>
                <span className="mt-3 text-sm font-semibold leading-snug text-brand-navy">{ta(`step${i + 1}`)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Purpose, mission, vision */}
      <section className="container mx-auto grid gap-6 px-4 py-12 md:px-6 md:py-14 lg:grid-cols-[0.8fr_1fr_1fr]">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{t('our-purpose')}</h2>
          <p className="mt-3 text-brand-navy-2/85">{ta("purposeText")}</p>
        </div>
        <PurposeCard icon={Target} tone="teal" title={t('our-mission')} text={ta("mission")} />
        <PurposeCard icon={Eye} tone="orange" title={t('our-vision')} text={ta("vision")} />
      </section>

      {/* Values */}
      <section className="container mx-auto grid gap-8 px-4 md:px-6 lg:grid-cols-[0.8fr_2.2fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{t('our-values')}</h2>
          <p className="mt-3 text-brand-navy-2/85">{ta("valuesText")}</p>
        </div>
        <div className="grid grid-cols-3 gap-y-6 sm:grid-cols-6">
          {values.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-2 px-2 text-center sm:border-s sm:border-brand-border sm:first:border-s-0">
              <v.icon className={`h-9 w-9 ${toneText(v.tone)}`} strokeWidth={1.6} />
              <span className="font-bold text-brand-navy">{ta(`v${i + 1}`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="container mx-auto grid items-center gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-2">
        <div className="relative">
          <span aria-hidden className="absolute -start-3 -top-3 h-24 w-24 rounded-tl-3xl border-s-[10px] border-t-[10px] border-brand-orange rtl:rounded-tl-none rtl:rounded-tr-3xl" />
          <img src="/imgs/services/e434d7b7-3d01-4719-b58a-182c67cad12b-ai01.webp" alt="" className="relative aspect-[16/9] w-full rounded-3xl object-cover shadow-[0_20px_50px_-24px_rgba(11,31,51,0.35)]" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{ta("whyTitle")}</h2>
          <ul className="mt-6 space-y-3.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="flex items-start gap-3 text-lg text-brand-navy-2">
                <Check className="mt-1 h-5 w-5 shrink-0 text-brand-orange" strokeWidth={3} />
                {ta(`why${n}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team Section */}
      {!!storeInfo?.teamMembers?.length && <section className="container mx-auto px-4 pb-14 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy mb-4">{tu("meetTeam")}</h2>
          <p className="text-brand-navy-2/80 max-w-2xl mx-auto">{tu("meetTeamText")}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {storeInfo?.teamMembers.map((member, index) => (
            <Card key={index} className="text-center border-brand-border shadow-sm">
              <CardContent className="pt-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={genStoreTeamMemberImageUrl(member.image)} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-brand-navy">{member.name}</h3>
                <p className="text-brand-orange font-medium mb-3">{member.role}</p>
                <p className="text-sm text-brand-navy-2/80">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>}

        {/* Store Locations */}
        {/* <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Store Locations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit us at any of our convenient locations. Each store offers a unique shopping experience tailored to
              the local community.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {branches.map((branch) => (
              <Card key={branch.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{branch.name}</CardTitle>
                      <Badge variant="outline">Est. {branch.established}</Badge>
                    </div>
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <p className="text-sm">{branch.address}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{branch.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{branch.email}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Store Hours</span>
                    </div>
                    <div className="space-y-1 ml-6">
                      {Object.entries(branch.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{day}:</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Store Manager:</span> {branch.manager}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Special Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {branch.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Get Directions
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Call Store
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section> */}

      {/* Closing call to action */}
      <section className="container mx-auto px-4 pb-14 md:px-6 md:pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-10 sm:px-10">
          <span aria-hidden className="pointer-events-none absolute -bottom-24 -end-16 h-56 w-56 rotate-12 rounded-[3rem] border-[30px] border-brand-teal/40" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="border-s-4 border-brand-orange ps-5">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{ta("ctaTitle")}</h2>
              <p className="mt-2 text-white/80">{ta("ctaText")}</p>
            </div>
            <Link href={`/${locale}/contact`} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-orange px-7 font-semibold text-white shadow-sm transition-opacity hover:opacity-90 md:me-24">
              {ta("ctaBtn")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function PurposeCard({ icon: Icon, tone, title, text }: { icon: LucideIcon; tone: "teal" | "orange"; title: string; text?: string | null }) {
  const teal = tone === "teal"
  return (
    <div className={`flex gap-5 rounded-2xl border p-6 sm:p-7 ${teal ? "border-brand-teal/15 bg-brand-green-soft" : "border-brand-orange/15 bg-brand-orange-soft"}`}>
      <Icon className={`h-12 w-12 shrink-0 ${teal ? "text-brand-teal" : "text-brand-orange"}`} strokeWidth={1.5} />
      <div className={`border-s-2 ps-5 ${teal ? "border-brand-teal/40" : "border-brand-orange/40"}`}>
        <h3 className={`text-sm font-bold uppercase tracking-[0.14em] ${teal ? "text-brand-teal" : "text-brand-orange"}`}>{title}</h3>
        <p className="mt-2 leading-relaxed text-brand-navy">{text}</p>
      </div>
    </div>
  )
}
