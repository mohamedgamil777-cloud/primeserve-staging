import { localizeContent } from "@/lib/content-ar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Users, Cookie, Mail } from "lucide-react"
import { getTenantId } from "@/lib/tenant"
import { db } from "@/db"
import { getTranslations } from "next-intl/server"

// Swap English-only text for its Arabic version on /ar
function localizeFields<T extends Record<string, unknown> | null | undefined>(obj: T, locale: string): T {
  if (!obj) return obj
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, typeof v === "string" ? localizeContent(v, locale) : v])) as T
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const [storeId,t] = await Promise.all([
    getTenantId(),
    getTranslations({"locale":(await params).locale})
  ])
  const storePriveyPolicy = localizeFields(await db.query.privacyPolicy.findFirst({
    "where":(privacyPolicy,{eq})=>eq(privacyPolicy.storeId,storeId)
  }), (await params).locale)
  const sections = [
    {
      id: "introduction",
      title: t('introduction'),
      icon: Shield,
      content:storePriveyPolicy?.introduction
    },
    {
      id: "information-collection",
      title: t('information-we-collect'),
      icon: Eye,
      content:storePriveyPolicy?.dataCollection
    },
    {
      id: "information-usage",
      title: t('how-we-use-your-information'),
      icon: Users,
      content:storePriveyPolicy?.dataUsage
    },
    {
      id: "information-security",
      title: t('data-security'),
      icon: Lock,
      content:storePriveyPolicy?.dataSecurity
    },
    {
      id: "cookies",
      title: t('cookies-and-tracking'),
      icon: Cookie,
      content:storePriveyPolicy?.cookies
    },
    {
      id: "third-party",
      title: t('third-party-information-sharing'),
      icon: Mail,
      content:storePriveyPolicy?.thirdParty
    },
  ]

  const rights = [
    t('access-your-personal-information-we-hold-about-you'),
    t('correct-or-update-inaccurate-personal-information'),
    t('delete-your-personal-information-subject-to-certain-exceptions'),
    t('restrict-or-object-to-the-processing-of-your-personal-information'),
    t('data-portability-receive-your-data-in-a-structured-format'),
    t('withdraw-consent-for-marketing-communications-at-any-time'),
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('privacy-policy')}</h1>
            <p className="text-xl text-muted-foreground mb-6">
              {t('we-are-committed-to-protecting-your-privacy-and-ensuring-the-security-of-your-personal-information')}
            </p>
            <Badge variant="outline" className="text-sm">
              {t('last-updated')} {storePriveyPolicy?.lastUpdated}
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          {
            storePriveyPolicy?.overview
            &&
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('privacy-overview')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    storePriveyPolicy?.overview
                  }
                </p>
              </CardContent>
            </Card>
          }

          {/* Main Sections */}
          {sections.map((section, index) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>{t('your-rights')}</CardTitle>
              <CardDescription>
                {t('you-have-certain-rights-regarding-your-personal-information-under-applicable-privacy-laws')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('depending-on-your-location-and-applicable-laws-you-may-have-the-following-rights')}
              </p>
              <ul className="space-y-2">
                {rights.map((right, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{right}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-6" />
              <p className="text-muted-foreground">
                {t('to-exercise-any-of-these-rights-please-contact-us-using-the-information-provided-in-the-contact-us-section-below-we-will-respond-to-your-request-within-the-timeframe-required-by-applicable-law')}
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          {
            storePriveyPolicy?.dataRetention
            &&
            <Card>
              <CardHeader>
                <CardTitle>{t('data-retention')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    storePriveyPolicy?.dataRetention
                  }
                </p>
              </CardContent>
            </Card>
          }

          {/* Children's Privacy */}
          {
            storePriveyPolicy?.childrenPrivacy
            &&
            <Card>
              <CardHeader>
                <CardTitle>{t('childrens-privacy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    storePriveyPolicy?.childrenPrivacy
                  }
                </p>
              </CardContent>
            </Card>
          }

          {/* International Transfers */}
          {
            storePriveyPolicy?.internationalDataTransfers
            &&
            <Card>
              <CardHeader>
                <CardTitle>{t('international-data-transfers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {storePriveyPolicy?.internationalDataTransfers}
                </p>
              </CardContent>
            </Card>
          }

          {/* Policy Updates */}
          {
            storePriveyPolicy?.changesToThisPolicy
            &&
            <Card>
              <CardHeader>
                <CardTitle>{t('changes-to-this-policy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    storePriveyPolicy?.changesToThisPolicy
                  }
                </p>
              </CardContent>
            </Card>
          }

          {/* Contact Information */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                If you have questions about this Privacy Policy or our privacy practices, please contact us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Privacy Officer</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: privacy@store.com
                    <br />
                    Phone: 1-800-PRIVACY
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mailing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    Privacy Department
                    <br />
                    123 Corporate Blvd, Suite 500
                    <br />
                    Business City, NY 10001
                  </p>
                </div>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                We will respond to your privacy-related inquiries within 30 days of receipt. For urgent privacy
                concerns, please call our privacy hotline.
              </p>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
