import { localizeContent } from "@/lib/content-ar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, DollarSign, Star, CheckCircle, AlertCircle, Calendar, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { db } from "@/db"
import { getTenantId } from "@/lib/tenant"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { getLocalizedValue } from "@/types/internationalization"

// const reviews = [
//   {
//     id: 1,
//     customerName: "John D.",
//     rating: 5,
//     comment:
//       'Excellent service! The technician was professional and did a perfect job mounting our 65" TV. Highly recommended!',
//     date: "2024-01-15",
//   },
//   {
//     id: 2,
//     customerName: "Sarah M.",
//     rating: 5,
//     comment: "Very satisfied with the cable management. The installation looks clean and professional.",
//     date: "2024-01-10",
//   },
//   {
//     id: 3,
//     customerName: "Mike R.",
//     rating: 4,
//     comment: "Good service, arrived on time and completed the work efficiently. Would use again.",
//     date: "2024-01-08",
//   },
// ]

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string, locale:string }> }) {
  const reviews:any[] = []
  const { id, locale } = await params
  const [
    storeId,t
  ] = await Promise.all(
    [
      getTenantId(),
      getTranslations({locale})
    ]
  )
  const tu = await getTranslations({ locale, namespace: "ui" })
  const contactInfo = await db.query.contactInformation.findFirst({
    where: (contactInformation, { eq }) => eq(contactInformation.storeId, storeId),
    columns: { customerServicePhone: true, supportEmail: true },
  })
  const supportPhone = contactInfo?.customerServicePhone?.trim() || null
  const supportEmail = contactInfo?.supportEmail?.trim() || null
  const service = await db.query.services.findFirst({
    "where":(services,{eq,and})=>and(
      eq(services.storeId,storeId),
      eq(services.id,id)
    ),
    "with":{
      "category":{
        "columns":{
          "nameI18n":true
        }
      },
      "images":{
        "columns":{
          "src":true,
          "sortOrder":true
        }
      },
      "addOns":{
        "columns":{
          "name":true,
          "price":true
        }
      }
    },
    "columns":{
      "id":true,
      "nameI18n":true,
      "shortDescriptionI18n":true,
      "longDescriptionI18n":true,
      "estimatedDuration":true,
      "price":true,
      "pricingModel":true,
      "rating":true,
      "reviewCount":true,
      "type":true,
      "requirements":true,
      "features":true,
      "inclusions":true
    }
  })
  if(!service) redirect("/services")
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{getLocalizedValue(service.category.nameI18n,locale as "en")}</Badge>
              <Badge variant="outline">{localizeContent(service.type, locale)}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4">{getLocalizedValue(service.nameI18n,locale as "en")}</h1>
            <p className="text-lg text-muted-foreground mb-6">{getLocalizedValue(service.shortDescriptionI18n,locale as "en")}</p>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">EGP {service.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{service.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{service.rating}</span>
                <span className="text-muted-foreground">{tu("reviewsCount",{count:service.reviewCount ?? 0})}</span>
              </div>
            </div>
          </div>

          {/* Service Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {service.images.sort((img1,img2)=> img1.sortOrder - img2.sortOrder).map((image, index) => (
              <div key={index} className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={image.src || "/placeholder.png"}
                  alt={`${getLocalizedValue(service.nameI18n,locale as "en")} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Service Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('service-description')}</h2>
              <p className="text-muted-foreground leading-relaxed">{getLocalizedValue(service.longDescriptionI18n,locale as "en")}</p>
            </div>

            {
              service.inclusions.length > 0 
              &&
              <>              
                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('whats-included')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.inclusions.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{localizeContent(item, locale)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }

            {
              service.features.length > 0
              &&
              <>
              
                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('service-features')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span>{localizeContent(feature, locale)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }

            {
              service.requirements.length > 0
              &&
              <>
                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('requirements')}</h3>
                  <div className="space-y-2">
                    {service.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <span>{localizeContent(requirement, locale)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }

            {/* Additional Services */}
            {service.addOns.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('additional-services')}</h3>
                  <div className="space-y-3">
                    {service.addOns.map((addon, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{addon.name}</span>
                        <span className="font-semibold">+EGP {addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reviews Section */}
          {
            reviews.length > 0 
            &&            
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('customer-reviews')}</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.customerName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('book-this-service')}</CardTitle>
              <CardDescription>{t('schedule-your-installation-today')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{service.pricingModel === "fixed" ? `${service.price}` : t('quote-needed')} </div>
                <div className="text-sm text-muted-foreground">{service.pricingModel === "quote" ? t('price-varies') : t('fixed-price')}</div>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href={`/${locale}/services/${service.id}/${service.pricingModel === "quote" ? "quote" : "quote"}`}>
                  <Calendar className="mr-2 h-5 w-5" />
                  {service.pricingModel === "quote" ? t('request-quote') : t('book-now')}
                </Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/${locale}/contact`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {t('call-for-questions')}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('need-help')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  {supportPhone
                    ? <a dir="ltr" href={`tel:${supportPhone.replace(/\s/g, "")}`} className="font-semibold hover:underline">{supportPhone}</a>
                    : <Link href={`/${locale}/contact`} className="font-semibold hover:underline">{t('contact')}</Link>}
                  <div className="text-sm text-muted-foreground">{t('available-24-7')}</div>
                </div>
              </div>

              {supportEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <a href={`mailto:${supportEmail}`} className="break-all font-semibold hover:underline">{supportEmail}</a>
                    <div className="text-sm text-muted-foreground">{t('well-respond-within-24-hours')}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Guarantee */}
          <Card>
            <CardHeader>
              <CardTitle>{t('our-guarantee')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">{t('90-day-warranty')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">{t('licensed-technicians')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">{t('satisfaction-guaranteed')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">{t('insured-service')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
