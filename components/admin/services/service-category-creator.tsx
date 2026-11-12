'use client'

import { PropsWithChildren, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Plus } from 'lucide-react'
import { IconPicker } from '@/components/icon-picker'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { insertServiceCategorySchema } from '@/db/schema/serviceCategories'
import { ExistingServiceCategory } from '@/types/serviceCategory'
import { updateServiceCategory } from '@/actions/serviceCategory'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { genServiceCategoriesQueryKeys } from '@/hooks/use-service-categories'
import { ImageUpload } from '@/components/image-upload'
import { DEFAULT_STORE_LANGUAGE } from '@/consts'
import { genEmptyI18nObject, getLocalizedValue, supportedLocales } from '@/types/internationalization'
import { useLocale } from '@/hooks/use-locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'

type CategoryFormValues = z.infer<typeof insertServiceCategorySchema>
type Props = {
  serviceCategory?:Partial<Pick<ExistingServiceCategory,"id"|"nameI18n"|"descriptionI18n"|"icon"|"isActive"|"isFeatured"|"image"|"longDescriptionI18n">>,
}


export default function ServiceCategoryCreator({children,serviceCategory}:PropsWithChildren<Props>) {
  const defaultLanguage = DEFAULT_STORE_LANGUAGE
  const t = useTranslations()
  const locale = useLocale()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(insertServiceCategorySchema),
    defaultValues: {
      id: serviceCategory?.id,
      nameI18n: serviceCategory?.nameI18n ?? genEmptyI18nObject([...supportedLocales]),
      icon: serviceCategory?.icon ?? "Monitor",
      descriptionI18n: serviceCategory?.descriptionI18n ?? genEmptyI18nObject([...supportedLocales]),
      longDescriptionI18n: serviceCategory?.longDescriptionI18n ?? genEmptyI18nObject([...supportedLocales]),
      isActive: serviceCategory?.id ? serviceCategory.isActive : true,
      isFeatured: serviceCategory?.id ? serviceCategory.isFeatured : false,
    },
  })

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true)
    try {
      const res = await updateServiceCategory({...values,"image":undefined})
      if(res.error) toast.error(res.error)
      else{
        if(values.image){
          const imageFormData = new FormData();
          imageFormData.append("image", values.image);
          await fetch(`/api/services/categories/${res.serviceCategoryId}/media`, {
            method: "POST",
            body: imageFormData,
          })
        }
        await queryClient.invalidateQueries({"queryKey":genServiceCategoriesQueryKeys()})
        toast.success(`Category "${getLocalizedValue(values.nameI18n,locale)}" has been ${values.id ? "updated" : "added"} successfully.`)
        setIsCreateDialogOpen(false)
        form.reset()
      }
    } catch (error) {
        toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        {
          children ??
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('add-category')}
          </Button>
        }
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>{serviceCategory?.id ? t('update-category') : t('create-new-category')}</DialogTitle>
          <DialogDescription>{serviceCategory?.id ? t('change-the-inputs-below-to-update-this-category') : t('add-a-new-service-category')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="default">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="default">{t('default')}</TabsTrigger>
                <TabsTrigger value="translations">{t('translations')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="default" className="space-y-4">
                {/* Non-translatable fields and default language fields */}
                <FormField
                  control={form.control}
                  name={`nameI18n.${defaultLanguage}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category-name')} ({t(defaultLanguage)})</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter-category-name')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`descriptionI18n.${defaultLanguage}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('short-description')} ({t(defaultLanguage)})</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('category-description')} rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`longDescriptionI18n.${defaultLanguage}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('long-description')} ({t(defaultLanguage)})</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('category-long-description')} rows={6} {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category-photo-optional')}</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => form.setValue("image", "")}
                          aspectRatio="logo"
                          label={t('upload-photo')}
                          description={t('drag-and-drop-or-click-to-upload-your-category-photo')}
                          maxSizeMB={2}
                          defaultImgPreview={serviceCategory?.image ? `/api/imgs/categories/${serviceCategory.image}` :  undefined}
                        />
                      </FormControl>
                      <FormDescription>{t('recommended-size-400x400px-png-or-jpg-format')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          id="isActive"
                        />
                      </FormControl>
                      <FormLabel htmlFor="isActive">{t('active-category')}</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          id="isFeatured"
                        />
                      </FormControl>
                      <FormLabel htmlFor="isFeatured">{t('featured-category')}</FormLabel>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="translations" className="space-y-4">
                {/* Translation fields for other languages */}
                {supportedLocales.filter(lang => lang !== defaultLanguage).map(lang => (
                  <div key={lang} className="space-y-4 border-b pb-4 last:border-b-0">
                    <h3 className="font-medium">{lang.toUpperCase()} {t('translations')}</h3>
                    
                    <FormField
                      control={form.control}
                      name={`nameI18n.${lang}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('category-name')} ({t(lang)})</FormLabel>
                          <FormControl>
                            <Input placeholder={`${t('enter-category-name-in')} ${t(lang)}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`descriptionI18n.${lang}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('short-description')} ({t(lang)})</FormLabel>
                          <FormControl>
                            <Textarea placeholder={`${t('category-description-in')} ${t(lang)}`} rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`longDescriptionI18n.${lang}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('long-description')} ({t(lang)})</FormLabel>
                          <FormControl>
                            <Textarea placeholder={`${t('category-long-description-in')} ${t(lang)}`} rows={6} {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-2">
              <Button disabled={isSubmitting} type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button disabled={isSubmitting} type="submit">{serviceCategory?.id ? t('update') : t('create')} {t('category')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
