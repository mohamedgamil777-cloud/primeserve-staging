"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateCategory } from "@/actions/category"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { insertCategorySchema } from "@/db/schema/categories"
import { genCategoriesQueryKeys, useCategories } from "@/hooks/use-categories"
import { ImageUpload } from "@/components/image-upload"
import { genEmptyI18nObject, getLocalizedValue, sanitizeI18nObject, supportedLocales } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"


type CategoryFormValues = z.infer<typeof insertCategorySchema>

export default function CategoryForm() {
  const locale = useLocale()
  const t = useTranslations()
  const params = useParams()
  const router = useRouter()
  const isEditMode = params.id !== "new"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const { data:categories,isLoading } = useCategories()
  const category = categories?.find(item=>item.id === params.id)

  // Initialize form with default values or existing category data
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: isEditMode
      ? {
          id: category?.id,
          nameI18n: category?.nameI18n ? sanitizeI18nObject(category?.nameI18n) : genEmptyI18nObject([...supportedLocales]),
          descriptionI18n: category?.descriptionI18n ? sanitizeI18nObject(category?.descriptionI18n) : genEmptyI18nObject([...supportedLocales]),
          featured: category?.featured,
        }
      : {
          nameI18n: genEmptyI18nObject([...supportedLocales]),
          descriptionI18n: genEmptyI18nObject([...supportedLocales]),
          featured: false,
        },
  })

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true)
    try {
      const res = await updateCategory({...values,"image":""})
      if(res.error) toast.error(res.error)
      else{
        if(values.image){
          const imageFormData = new FormData();
          imageFormData.append("image", values.image);
          await fetch(`/api/categories/${res.categoryId}/media`, {
            method: "POST",
            body: imageFormData,
          })
        }
        await queryClient.invalidateQueries({"queryKey":genCategoriesQueryKeys()})
        toast.success(`Category "${getLocalizedValue(values.nameI18n,locale)}" has been ${values.id ? "updated" : "added"} successfully.`)
        form.reset();
        router.push("/admin/categories")
      }
    } catch (error) {
        toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsSubmitting(false)
  }

  useEffect(()=>{
    if(category) form.reset({
      id: category?.id,
      nameI18n: category?.nameI18n,
      descriptionI18n: category?.descriptionI18n,
      featured: category?.featured,
    })
  },[category])

  if(isLoading) return null
  if(isEditMode && !category) router.replace("/admin/categories")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? t('edit-category') : t('add-new-category')}</h1>
          <p className="text-muted-foreground">
            {isEditMode ? t('update-category-information') : t('create-a-new-product-category')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/categories")}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit,(err)=>console.log(err))} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              {supportedLocales.map((locale) => (
                <FormField
                  key={locale}
                  control={form.control}
                  name={`nameI18n.${locale}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          {t('name')} [{t(locale)}]
                        </FormLabel>
                        <Badge variant="outline" className="text-xs">{locale.toUpperCase()}</Badge>
                      </div>
                      <FormControl>
                        <Input
                          placeholder={`${t('enter-category-name')} (${locale.toUpperCase()})`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {supportedLocales.map((locale) => (
                <FormField
                  key={locale}
                  control={form.control}
                  name={`descriptionI18n.${locale}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          {t('description')} [{t(locale)}]
                        </FormLabel>
                        <Badge variant="outline" className="text-xs">{locale.toUpperCase()}</Badge>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder={`${t('enter-description')} (${locale.toUpperCase()})`}
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
  
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t('featured-category')}</FormLabel>
                      <FormDescription>{t('display-this-category-prominently-on-the-homepage')}</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('photo-optional')}</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={() => form.setValue("image", "")}
                        aspectRatio="logo"
                        label={t('upload-logo')}
                        description={t('drag-and-drop-or-click-to-upload-your-category-logo')}
                        maxSizeMB={2}
                        defaultImgPreview={category?.image ? `/api/imgs/categories/${category.image}` :  undefined}
                      />
                    </FormControl>
                    <FormDescription>{t('recommended-size-400x400px-png-or-jpg-format')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div>
                <h3 className="text-lg font-medium mb-4">Category Image</h3>

                {!image ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No image uploaded</h3>
                    <p className="text-sm text-muted-foreground mb-4">Upload an image to represent this category</p>
                    <Button type="button" onClick={handleImageUpload}>
                      Upload Image
                    </Button>
                  </div>
                ) : (
                  <Card className="overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <img src={image || "/placeholder.png"} alt="Category image" className="object-cover w-full h-full" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div> */}

              {isEditMode && (
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">{t('statistics')}</h3>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('products')}:</span>
                      <span className="font-medium">{category?.subcategories.reduce((acc,cur)=>acc+cur["productCount"],0).toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('created')}:</span>
                      <span className="font-medium">{(category?.createdAt ? new Date(category?.createdAt) : new Date()).toDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('last-updated-0')}:</span>
                      <span className="font-medium">{new Date().toDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </form>
      </Form>
    </div>
  )
}
