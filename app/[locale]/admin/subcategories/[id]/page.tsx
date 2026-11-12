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
import { updateSubCategory } from "@/actions/subcategory"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { insertSubCategorySchema } from "@/db/schema/subcategories"
import { genCategoriesQueryKeys, useCategories } from "@/hooks/use-categories"
import { ImageUpload } from "@/components/image-upload"
import { genEmptyI18nObject, getLocalizedValue, supportedLocales } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"


type SubCategoryFormValues = z.infer<typeof insertSubCategorySchema>

export default function SubCategoryForm() {
  const locale = useLocale()
  const t = useTranslations()
  const params = useParams()
  const router = useRouter()
  const isEditMode = params.id !== "new"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const { data:categories,isLoading } = useCategories()
  const subcategory = categories?.flatMap(cat=>cat.subcategories)?.find(item=>item.id === params.id)

  // Initialize form with default values or existing subcategory data
  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(insertSubCategorySchema),
    defaultValues: {
      id: subcategory?.id,
      nameI18n: subcategory?.nameI18n ?? genEmptyI18nObject([...supportedLocales]),
      descriptionI18n: subcategory?.descriptionI18n ?? genEmptyI18nObject([...supportedLocales]),
      categoryId: subcategory?.categoryId,
      // featured: subcategory?.featured,
    }
  })

  async function onSubmit(values: SubCategoryFormValues) {
    setIsSubmitting(true)
    try {
      const res = await updateSubCategory({...values,"image":""})
      if(res.error) toast.error(res.error)
      else{
        if(values.image){
          const imageFormData = new FormData();
          imageFormData.append("image", values.image);
          await fetch(`/api/subcategories/${res.subcategoryId}/media`, {
            method: "POST",
            body: imageFormData,
          })
        }
        await queryClient.invalidateQueries({"queryKey":genCategoriesQueryKeys()})
        toast.success(`Sub Category "${values.nameI18n[locale]}" has been ${values.id ? "updated" : "added"} successfully.`)
        form.reset();
        router.push("/admin/categories")
      }
    } catch (error) {
        toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsSubmitting(false)
  }

  useEffect(()=>{
    if(subcategory) form.reset({
      id: subcategory?.id,
      nameI18n: subcategory?.nameI18n ?? genEmptyI18nObject([...supportedLocales]),
      descriptionI18n: subcategory?.descriptionI18n ?? genEmptyI18nObject([...supportedLocales]),
      categoryId: subcategory?.categoryId,
      // featured: subcategory?.featured,
    })
  },[subcategory])

  if(isLoading) return null
  if((isEditMode && !subcategory) || categories?.length === 0) router.replace("/admin/categories")
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? t('edit-subcategory') : t('add-new-subcategory')}</h1>
          <p className="text-muted-foreground">
            {isEditMode ? t('update-subcategory-information') : t('create-a-new-product-subcategory')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/categories")}>
            {t('cancel')}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit,(err)=>console.log(err))} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? t('update-subcategory') : t('create-subcategory')}
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
                          placeholder={`${t('enter-name')} (${locale.toUpperCase()})`}
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
  


              {
                !!categories?.length
                &&
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('parent-category')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger className=" w-full">
                            <SelectValue placeholder={t('select-a-parent-category')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* <SelectItem value="none">None (Top Level)</SelectItem> */}
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {getLocalizedValue(category.nameI18n,locale)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>{t('select-a-parent-category-to-create-a-subcategory')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
{/* 
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured SubCategory</FormLabel>
                      <FormDescription>Display this subcategory prominently on the homepage</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
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
                        description={t('drag-and-drop-or-click-to-upload-your-subcategory-logo')}
                        maxSizeMB={2}
                        defaultImgPreview={subcategory?.image ? `/api/imgs/categories/${subcategory.image}` :  undefined}
                      />
                    </FormControl>
                    <FormDescription>{t('recommended-size-400x400px-png-or-jpg-format')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div>
                <h3 className="text-lg font-medium mb-4">SubCategory Image</h3>

                {!image ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No image uploaded</h3>
                    <p className="text-sm text-muted-foreground mb-4">Upload an image to represent this subcategory</p>
                    <Button type="button" onClick={handleImageUpload}>
                      Upload Image
                    </Button>
                  </div>
                ) : (
                  <Card className="overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <img src={image || "/placeholder.png"} alt="SubCategory image" className="object-cover w-full h-full" />
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
                      {/* <span className="font-medium">{mockSubCategory.products}</span> */}
                      <span className="font-medium">{subcategory?.productCount.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('created')}:</span>
                      <span className="font-medium">{new Date(subcategory?.createdAt!).toDateString()}</span>
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
