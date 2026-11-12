"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from "lucide-react"
import { FAQCategoryTree } from "@/db/schema/faqCategories"
import { useTranslations } from "next-intl"

export default function FAQPage({storeFAQS}:{storeFAQS:FAQCategoryTree[]}) {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const filteredFAQs = storeFAQS
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          (selectedCategory === "all" || category.id === selectedCategory) &&
          (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('frequently-asked-questions')}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('find-quick-answers-to-common-questions-cant-find-what-youre-looking-for-contact-our-support-team')}
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('search-faqs')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{t('categories')}</CardTitle>
                <CardDescription>{t('browse-by-topic')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  {t('ui.allQuestions')}
                </Button>
                {storeFAQS.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3 space-y-8">
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">{t('no-faqs-found-matching-your-search')}</p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    {t('clear-search')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <Badge variant="secondary">{category.faqs.length}</Badge>
                  </div>
                  <div className="space-y-4">
                    {category.faqs.map((faq) => (
                      <Card key={faq.id}>
                        <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-left text-lg">{faq.question}</CardTitle>
                                {openItems.includes(faq.id) ? (
                                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Section */}
        <section className="mt-16 bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">{t('still-need-help')}</h2>
            <p className="text-muted-foreground">
              {t('cant-find-the-answer-youre-looking-for-our-customer-support-team-is-here-to-help')}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 max-w-xl mx-auto">
            <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
              <a href="/support">
                <MessageCircle className="h-6 w-6" />
                <span className="font-medium">{t('supportHub.nav')}</span>
                <span className="text-xs text-muted-foreground">{t('24hr-response')}</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
              <a href="/contact">
                <Mail className="h-6 w-6" />
                <span className="font-medium">{t('contact-form')}</span>
                <span className="text-xs text-muted-foreground">{t('24hr-response')}</span>
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
