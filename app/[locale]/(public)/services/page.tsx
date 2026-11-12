import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"
import AllServiceCategories from "@/components/admin/services/all-service-categories"
import AllServiceCategoriesSkeleton from "@/components/admin/services/all-service-categories-skeleton"
import FeaturedServices from "@/components/admin/services/featured-services"
import FeaturedServicesSkeleton from "@/components/admin/services/featured-services-skeleton"
import { getTranslations } from "next-intl/server"

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const {locale} = await params
  const t = await getTranslations({locale})  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('professional-services-you-can-trust')}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('explore-a-wide-range-of-expert-services-tailored-to-your-personal-and-business-needs-all-in-one-place')}
        </p>
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/services">
              <Wrench className="mr-2 h-5 w-5" />
              Book a Service
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/services/quote">
              <Quote className="mr-2 h-5 w-5" />
              Request Quote
            </Link>
          </Button>
        </div> */}
      </div>

      {/* Search and Filter */}
      {/* <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search services..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {serviceCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="repair">Repair</SelectItem>
            <SelectItem value="installation">Installation</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Service Categories */}
      <Suspense fallback={<AllServiceCategoriesSkeleton/>}>
        <AllServiceCategories locale={locale}/>
      </Suspense>
      {/* <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Service Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="secondary">{category.count} services</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{category.description}</CardDescription>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/services/category/${category.id}`}>View Services</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section> */}

      {/* Featured Services */}
      <Suspense fallback={<FeaturedServicesSkeleton/>}>
        <FeaturedServices/>
      </Suspense>

      {/* CTA Section */}
      <section className="mt-16 text-center bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">{t('need-a-custom-solution')}</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          {t('we-offer-customized-service-packages-for-businesses-and-large-scale-installations-contact-us-for-a-personalized-quote')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href={`/${locale}/services/quote`}>{t('get-custom-quote')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={`/${locale}/contact`}>{t('contact-sales')}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
