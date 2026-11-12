"use client"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { z } from "zod"
import { heroSectionUpdateSchema } from "@/db/schema/storeAssets"
import { ImageUpload } from "@/components/image-upload"
import { useState } from "react"
import { updateStoreHeroSection } from "@/actions/store"
import { genEmptyI18nObject, supportedLocales } from "@/types/internationalization"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

export type HeroSectionFormValues = z.infer<typeof heroSectionUpdateSchema>



export function StoreHeroSectionForm({initialData}:{initialData?:Partial<HeroSectionFormValues>}) {
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<HeroSectionFormValues>({
    resolver: zodResolver(heroSectionUpdateSchema),
    defaultValues: {
      heroTitleI18n: initialData?.heroTitleI18n ?? genEmptyI18nObject([...supportedLocales]),
      heroDescriptionI18n: initialData?.heroDescriptionI18n ?? genEmptyI18nObject([...supportedLocales]),
      heroMainButtonTextI18n: initialData?.heroMainButtonTextI18n ?? genEmptyI18nObject([...supportedLocales]),
      heroMainButtonLink: initialData?.heroMainButtonLink ?? "",
      heroSecondaryButtonTextI18n: initialData?.heroSecondaryButtonTextI18n ?? genEmptyI18nObject([...supportedLocales]),
      heroSecondaryButtonLink: initialData?.heroSecondaryButtonLink ?? ""
    }
  })


  async function onSubmit(values: HeroSectionFormValues) {
    setIsSubmitting(true)
    try {
      const res = await updateStoreHeroSection({...values,"heroBackgroundImage":""})
      if(res.error) toast.error(res.error)
      else{
        if(values.heroBackgroundImage){
          const imageFormData = new FormData();
          imageFormData.append("image", values.heroBackgroundImage);
          await fetch(`/api/stores/media/hero`, {
            method: "POST",
            body: imageFormData,
          })
        }
        toast.success(`Store hero section has been updated successfully.`)
        form.reset();
      }
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
    setIsSubmitting(false)
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Homepage Hero Section</CardTitle>
            <CardDescription>Customize your homepage hero section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {supportedLocales.map((locale) => (
              <FormField
                key={locale}
                control={form.control}
                name={`heroTitleI18n.${locale}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">
                        {"Hero Title"} [{t(locale)}]
                      </FormLabel>
                      <Badge variant="outline" className="text-xs">{locale.toUpperCase()}</Badge>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={`${"Enter hero title"} (${locale.toUpperCase()})`}
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
                name={`heroDescriptionI18n.${locale}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">
                        {"Hero Description"} [{t(locale)}]
                      </FormLabel>
                      <Badge variant="outline" className="text-xs">{locale.toUpperCase()}</Badge>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder={`${"Enter hero description"} (${locale.toUpperCase()})`}
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Hero Background Image Upload */}
            <FormField
              control={form.control}
              name="heroBackgroundImage"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Hero Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => form.setValue("heroBackgroundImage", "")}
                      aspectRatio="logo"
                      label="Upload Logo"
                      description="Drag and drop or click to upload your product logo"
                      maxSizeMB={2}
                      defaultImgPreview={initialData?.heroBackgroundImage ? `/api/imgs/stores/${initialData?.heroBackgroundImage}` :  undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {supportedLocales.map((locale) => (
              <FormField
                key={locale}
                control={form.control}
                name={`heroMainButtonTextI18n.${locale}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">
                        {"Main Button Text"} [{t(locale)}]
                      </FormLabel>
                      <Badge variant="outline" className="text-xs">{locale.toUpperCase()}</Badge>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={`${"Enter button text"} (${locale.toUpperCase()})`}
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
              name="heroMainButtonLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Button Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter button link (e.g. /products)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {supportedLocales.map((locale) => (
              <FormField
                key={locale}
                control={form.control}
                name={`heroSecondaryButtonTextI18n.${locale}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">
                        {"Secondary Button Text"} [{t(locale)}]
                      </FormLabel>
                      <Badge variant="outline" className="text-xs">{locale.toUpperCase()}</Badge>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={`${"Enter button text"} (${locale.toUpperCase()})`}
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
              name="heroSecondaryButtonLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Button Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter button link (e.g. /products)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={isSubmitting} type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
