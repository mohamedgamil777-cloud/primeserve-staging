import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Clock, Users, Award, Heart, Target, Eye, Star } from "lucide-react"
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
  console.log(await params,t('get-it-on'))
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

  const stats = [
    { label: tu("yearsInBusiness"), value: storeInfo?.aboutPageContent?.yearsInBusiness, icon: Award },
    { label: tu("happyCustomers"), value: storeInfo?.aboutPageContent?.happyCustomers, icon: Users },
    // { label: "Store Locations", value: branches.length, icon: MapPin },
    { label: tu("productsAvailable"), value: storeInfo?.aboutPageContent?.productsAvailable, icon: Star },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#0B1F33] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">{storeInfo?.aboutPageContent?.heroTitle}</h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              {storeInfo?.aboutPageContent?.heroDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2"
                >
                  <stat.icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Mission, Vision, Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t('our-purpose')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('everything-we-do-is-guided-by-our-core-values-and-commitment-to-excellence')}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('our-mission')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  {storeInfo?.aboutPageContent?.mission}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('our-vision')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  {storeInfo?.aboutPageContent?.vision}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('our-values')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  {storeInfo?.aboutPageContent?.values}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        {!!storeInfo?.teamMembers?.length && <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{tu("meetTeam")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{tu("meetTeamText")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {storeInfo?.teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={genStoreTeamMemberImageUrl(member.image)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
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

        {/* Contact Section */}
        <section className="bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t('get-in-touch')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('have-questions-or-feedback-wed-love-to-hear-from-you-reach-out-to-us-through-any-of-these-channels')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t('customer-service')}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t('available-24-7-for-all-your-inquiries')}</p>
                <a href={`tel:${storeInfo?.contactInformation?.customerServicePhone}`} className="underline">
                  <p className="font-medium">{storeInfo?.contactInformation?.customerServicePhone}</p>
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t('email-support')}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t('well-respond-within-24-hours')}</p>
                <a href={`mailto:${storeInfo?.contactInformation?.supportEmail}`} className="underline">
                  <p className="font-medium">{storeInfo?.contactInformation?.supportEmail}</p>
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t('live-chat')}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t('chat-with-our-team-in-real-time')}</p>
                <Button size="sm">{t('start-chat')}</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
