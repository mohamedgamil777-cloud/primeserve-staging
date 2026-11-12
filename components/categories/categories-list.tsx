"use client"
import { useTranslations } from "next-intl"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailedCategory } from "@/types/category"
import { genCategoryImageUrl } from "@/lib/category"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"

export default function CategoriesList({categoriesPromise}:{categoriesPromise:Promise<DetailedCategory[]>}) {
  const tu = useTranslations("ui")
  const locale = useLocale()
  const categories = use(categoriesPromise)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const filteredCategories = categories
    .filter(
      (category) =>
        getLocalizedValue(category.nameI18n,locale)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getLocalizedValue(category.descriptionI18n,locale)?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        category.subcategories.some((subcategory) => getLocalizedValue(subcategory.nameI18n,locale)?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleCategory = (categoryId: string) => {
    if(!categories.find(cat=>cat.id === categoryId && cat.subcategories.length > 0)) return setExpandedCategory(null)
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  return (
    <>
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={tu("searchCategories")}
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">{tu("gridView")}</TabsTrigger>
          <TabsTrigger value="list">{tu("listView")}</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/${locale}/categories/${category.id}`}>
                  <Card className="overflow-hidden h-full group py-0">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10" />
                        <img
                          src={genCategoryImageUrl(category.image)}
                          alt={getLocalizedValue(category.nameI18n,locale)}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                          <h3 className="text-2xl font-bold">{getLocalizedValue(category.nameI18n,locale)}</h3>
                          <p className="text-sm text-white/80">{getLocalizedValue(category.descriptionI18n,locale)}</p>
                          <p className="text-sm text-white/80 mt-2">{category.subcategories.length} subcategories</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className="rounded-lg border overflow-hidden">
                <div className="flex items-center p-4 cursor-pointer" onClick={() => toggleCategory(category.id)}>
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md mr-4">
                    <img
                      src={genCategoryImageUrl(category.image)}
                      alt={getLocalizedValue(category.nameI18n,locale)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{getLocalizedValue(category.nameI18n,locale)}</h3>
                    <p className="text-sm text-muted-foreground">{getLocalizedValue(category.descriptionI18n,locale)}</p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${expandedCategory === category.id ? "rotate-90" : ""}`}
                  />
                </div>

                {expandedCategory === category.id && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted/30">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/${locale}/categories/${category.id}/${subcategory.id}`}
                        className="group"
                      >
                        <div className="rounded-lg border bg-card overflow-hidden transition-colors hover:border-primary">
                          <div className="aspect-square relative overflow-hidden">
                            <img
                              src={genCategoryImageUrl(subcategory.image)}
                              alt={getLocalizedValue(subcategory.nameI18n,locale)}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium">{getLocalizedValue(subcategory.nameI18n,locale)}</h4>
                            <p className="text-sm text-muted-foreground">{subcategory.productCount} products</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>

  )
}
