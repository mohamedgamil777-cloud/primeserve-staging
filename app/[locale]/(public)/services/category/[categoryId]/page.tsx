import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/db"
import { serviceCategories, services } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"
import { getTenantId } from "@/lib/tenant"
import PublicServicesList from "@/components/admin/services/public-services-list"
import { redirect } from "next/navigation"
import { genCategoryImageUrl } from "@/lib/category"
import { cn } from "@/lib/utils"
import { getLocalizedValue } from "@/types/internationalization"

export default async function CategoryServicesPage({ params }: { params: Promise<{ categoryId: string, locale:string }> }) {
  const [{ categoryId, locale }, storeId] = await Promise.all([
    params,
    getTenantId()
  ]) 
  const [[category],_storeDisplaySettings] = await Promise.all([
    db
      .select({
          "isActive":serviceCategories.isActive,
          "isFeatured":serviceCategories.isFeatured,
          "slug":serviceCategories.slug,
          id: serviceCategories.id,
          nameI18n: serviceCategories.nameI18n,
          image: serviceCategories.image,
          descriptionI18n: serviceCategories.descriptionI18n,
          longDescriptionI18n: serviceCategories.longDescriptionI18n,
          icon: serviceCategories.icon,
          createdAt: serviceCategories.createdAt,
          servicesCount: sql<number>`COUNT(${services.id})`.as('servicesCount'),
      })
      .from(serviceCategories)
      .where(
        and(
          eq(serviceCategories.storeId,storeId),
          eq(serviceCategories.id,categoryId),
        )
      )
      .leftJoin(services, sql`${services.categoryId} = ${serviceCategories.id}`)
      .groupBy(serviceCategories.id)
      .orderBy(serviceCategories.nameI18n),
    db.query.storeDisplaySettings.findFirst({
      "where":(storeDisplaySettings,{eq})=>eq(storeDisplaySettings.storeId,storeId)
    })
  ]) 

  if(!category) redirect("/services")

  return (
    <>
      <Card className="bg-[#192e5b] rounded-none">
        <div className="flex flex-col sm:flex-row gap-4 p-6">
          {category.image && (
            <div className="w-full sm:w-1/3 max-w-80">
              <div className={`aspect-square overflow-hidden shadow-sm rounded-md`}>
                <img
                  className="w-full h-full object-cover"
                  src={genCategoryImageUrl(category.image)} 
                  alt={getLocalizedValue(category.nameI18n,locale as "en")}
                />
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center">
            <CardHeader className="p-0">
              <CardTitle className={`text-[#81CDC8] text-4xl font-bold`}>{getLocalizedValue(category.nameI18n,locale as "en")}</CardTitle>
              <CardDescription className="text-white text-lg">{getLocalizedValue(category.longDescriptionI18n,locale as "en") ?? getLocalizedValue(category.descriptionI18n,locale as "en")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <p className="text-sm">{category.servicesCount} services available</p>
            </CardContent>
            <Link 
              className={cn(buttonVariants({"variant":"default"}),"block mt-4 w-fit font-bold")} 
              href={`/${locale}/contact`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Card>
      <div className="container px-4 py-8 mx-auto">
        {/* <div className="flex items-center gap-2 mb-6">
          <Link href="/services" className="text-muted-foreground hover:text-foreground">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              All Services
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>{category.name}</span>
        </div> */}

        {/* <div className="grid gap-6 md:grid-cols-[300px_1fr]"> */}
        <div className="grid gap-6 md:grid-cols-1">
          {/* Filters Sidebar */}
          {/* <ServiceFilters/> */}

          {/* Main Content */}
          <div className="space-y-6">
            {/* Category Header */}
            {/* <Card className="bg-muted/50"> */}
            {/* <Card className="bg-[#192e5b]">
              <div className="flex flex-col sm:flex-row gap-4 p-6">
                {category.image && (
                  <div className="w-full sm:w-1/3">
                    <img 
                      src={genCategoryImageUrl(category.image)} 
                      alt={category.name}
                      className="w-full h-full rounded-md object-cover max-h-48 sm:max-h-full"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardHeader className="p-0">
                    <CardTitle className={`text-[#81CDC8] text-3xl`}>{category.name}</CardTitle>
                    <CardDescription className="text-white">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <p className="text-sm">{category.servicesCount} services available</p>
                  </CardContent>
                </div>
              </div>
            </Card> */}
            {/* Services List Controls */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">View:</span>
                <Tabs defaultValue="grid" className="w-[160px]">
                  <TabsList>
                    <TabsTrigger value="grid" className="flex items-center gap-1">
                      <Grid3X3 className="h-4 w-4" />
                      <span>Grid</span>
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-1">
                      <ListFilter className="h-4 w-4" />
                      <span>List</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div> */}
            <PublicServicesList detailed={_storeDisplaySettings?.serviceStyle === "detailed"} categoryId={categoryId}/>
          </div>
        </div>
      </div>
    </>
  )
}
