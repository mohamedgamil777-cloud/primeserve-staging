import { localizeContent } from "@/lib/content-ar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Clock, Users, Award, Target, Eye, ArrowRight, Building2, Box, BarChart3, ShoppingCart, Settings, Zap, Layers, Leaf, ShieldCheck, Lightbulb, PlayCircle, type LucideIcon } from "lucide-react"
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

  const highlights = [
    { icon: Building2, t: "s1t", x: "s1x" },
    { icon: Box, t: "s2t", x: "s2x" },
    { icon: Users, t: "s3t", x: "s3x" },
    { icon: BarChart3, t: "s4t", x: "s4x" },
  ]
  const solutions = [
    { icon: ShoppingCart, tone: "orange" as const, t: "c1t", x: "c1x", href: `/${locale}/categories` },
    { icon: Settings, tone: "teal" as const, t: "c2t", x: "c2x", href: `/${locale}/services` },
    { icon: Users, tone: "orange" as const, t: "c3t", x: "c3x", href: `/${locale}/employee-experience` },
  ]
  const principles = [
    { icon: Zap, tone: "orange" as const, n: 1 },
    { icon: Award, tone: "teal" as const, n: 2 },
    { icon: Layers, tone: "orange" as const, n: 3 },
    { icon: Leaf, tone: "teal" as const, n: 4 },
    { icon: ShieldCheck, tone: "orange" as const, n: 5 },
    { icon: Lightbulb, tone: "teal" as const, n: 6 },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <span aria-hidden className="pointer-events-none absolute -bottom-32 -start-40 hidden h-72 w-72 rounded-full bg-brand-green-soft xl:block" />
        <div className="container relative mx-auto grid items-center gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-teal sm:text-sm">
              <span className="h-0.5 w-10 bg-brand-orange" />
              {ta("eyebrow")}
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-navy md:text-5xl xl:text-6xl">
              {ta("h1a")}<br /><span className="text-brand-orange">{ta("h1b")}</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-brand-navy-2">{ta("heroText")}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={`/${locale}/services`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
                {ta("explore")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link href={`/${locale}/contact`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-brand-navy px-6 font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white">
                <PlayCircle className="h-5 w-5" />
                {ta("talk")}
              </Link>
            </div>
          </div>
          <div className="relative">
            <img src="/imgs/banners/hero-devices.webp" alt="" className="w-full rounded-3xl border border-brand-border object-cover shadow-[0_20px_50px_-24px_rgba(11,31,51,0.35)]" />
          </div>
        </div>

        {/* Highlights strip */}
        <div className="container relative mx-auto px-4 pb-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-brand-teal/10 bg-brand-green-soft p-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 lg:justify-center lg:border-s lg:border-brand-teal/15 lg:px-4 lg:first:border-s-0">
                <h.icon className="h-8 w-8 shrink-0 text-brand-teal" strokeWidth={1.6} />
                <div>
                  <div className="font-bold text-brand-navy">{ta(h.t)}</div>
                  <div className="text-sm text-brand-navy-2/80">{ta(h.x)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business solutions */}
      <section className="container mx-auto px-4 py-14 md:px-6 md:py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{ta("solTitle")}</h2>
        <p className="mt-2 text-brand-navy-2/80">{ta("solText")}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {solutions.map((c, i) => (
            <Link key={i} href={c.href} className="group flex h-full gap-4 rounded-2xl border border-brand-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
              <IconBox icon={c.icon} tone={c.tone} />
              <div className="flex flex-1 flex-col">
                <h3 className="text-lg font-bold text-brand-navy">{ta(c.t)}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-brand-navy-2/80">{ta(c.x)}</p>
                <span className="mt-3 flex h-7 w-7 items-center justify-center self-end rounded-full bg-brand-orange-soft text-brand-orange transition-colors group-hover:bg-brand-orange group-hover:text-white">
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Purpose, mission, vision */}
      <section className="bg-brand-gray py-14 md:py-16">
        <div className="container mx-auto grid gap-6 px-4 md:px-6 lg:grid-cols-[0.8fr_1fr_1fr]">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{t('our-purpose')}</h2>
            <p className="mt-3 text-lg text-brand-navy-2/85">{ta("purposeText")}</p>
          </div>
          <PurposeCard icon={Target} tone="teal" title={t('our-mission')} text={ta("mission")} />
          <PurposeCard icon={Eye} tone="orange" title={t('our-vision')} text={ta("vision")} />
        </div>
      </section>

      {/* Principles */}
      <section className="container mx-auto px-4 py-14 md:px-6 md:py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{ta("prTitle")}</h2>
        <p className="mt-2 text-brand-navy-2/80">{ta("prText")}</p>
        <div className="mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {principles.map((p) => (
            <div key={p.n} className="pe-4 lg:border-s lg:border-brand-border lg:px-4 lg:first:border-s-0 lg:first:ps-0">
              <p.icon className={`h-8 w-8 ${p.tone === "teal" ? "text-brand-teal" : "text-brand-orange"}`} strokeWidth={1.6} />
              <h3 className="mt-3 text-lg font-bold text-brand-navy">{ta(`p${p.n}t`)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-brand-navy-2/80">{ta(`p${p.n}x`)}</p>
            </div>
          ))}
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

function IconBox({ icon: Icon, tone }: { icon: LucideIcon; tone: "teal" | "orange" }) {
  return (
    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tone === "teal" ? "bg-brand-green-soft text-brand-teal" : "bg-brand-orange-soft text-brand-orange"}`}>
      <Icon className="h-7 w-7" strokeWidth={1.6} />
    </span>
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
