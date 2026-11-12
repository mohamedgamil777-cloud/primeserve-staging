import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle, Send, Building } from "lucide-react"
import ContactForm from "@/components/contact-form"
import { getTenantId } from "@/lib/tenant"
import { db } from "@/db"
import ContactUsForm from "@/components/contact-us-form"
import { getTranslations } from "next-intl/server"

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const [storeId,t] = await Promise.all([
    getTenantId(),
    getTranslations({"locale":(await params).locale})
  ])
  const contactInfo = await db.query.contactInformation.findFirst({
    "where":(contactInformation,{eq})=>eq(contactInformation.storeId,storeId),
    "columns":{
      "customerServicePhone":true,
      "supportEmail":true,
    }
  })
  const contactMethods = [
    {
      icon: Phone,
      title: t('customer-service'),
      description: t('available-24-7-for-all-your-inquiries'),
      contact: contactInfo?.customerServicePhone,
      action: t('call-now'),
      actionHref:`tel:${contactInfo?.customerServicePhone}`
    },
    {
      icon: Mail,
      title: t('email-support'),
      description: t('well-respond-within-24-hours'),
      contact: contactInfo?.supportEmail,
      action: t('send-email'),
      actionHref: `mailto:${contactInfo?.supportEmail}`
    },
    {
      icon: MessageCircle,
      title: t('live-chat'),
      description: t('chat-with-our-team-in-real-time'),
      contact: t('available-mon-fri-9am-6pm-est'),
      action: t('start-chat'),
      actionHref: "#"
    },
  ]


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#004957] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">{t('get-in-touch')}</h1>
            <p className="text-xl mb-8 text-gray-100">
              {t('were-here-to-help-reach-out-to-us-through-any-of-the-methods-below-and-well-get-back-to-you-as-soon-as-possible')}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Contact Methods */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t('how-can-we-help')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('choose-the-contact-method-that-works-best-for-you-our-team-is-ready-to-assist-with-any-questions-or-concerns')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <method.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                  <p className="font-medium mb-4">{method.contact}</p>
                  <Button asChild className="w-full">
                    <a href={method.actionHref}>
                      {method.action}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        {/* <ContactForm/> */}
        <ContactUsForm/>
        {/* FAQ Quick Links */}
        <section className="bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">{t('need-quick-answers')}</h2>
            <p className="text-muted-foreground">
              {t('check-out-our-frequently-asked-questions-for-instant-answers-to-common-inquiries')}
            </p>
          </div>
          <div className="flex justify-center">
            <Button size="lg" variant="outline" asChild>
              <a href="/faq">{t('view-faq')}</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
