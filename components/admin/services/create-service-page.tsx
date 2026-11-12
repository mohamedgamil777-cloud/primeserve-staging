"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Plus, Trash2, ArrowLeft, Upload, X } from "lucide-react"
import { insertServiceSchema } from "@/db/schema/services"
import ImageGallerySelector, { ImageItem } from "@/components/image-gallery-selector"
import { ExistingService } from "@/types/services"
import { useServiceCategories } from "@/hooks/use-service-categories"
import { useQueryClient } from "@tanstack/react-query"
import { updateService } from "@/actions/service"
import { genServiceImageUrl } from "@/lib/service"
import { genEmptyI18nObject, getLocalizedValue, supportedLocales } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"
import { DEFAULT_STORE_LANGUAGE } from "@/consts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"


type ServiceFormValues = z.infer<typeof insertServiceSchema>

export default function CreateServicePage({service}:{service?:Partial<ExistingService>}) {
  const defaultLanguage = DEFAULT_STORE_LANGUAGE
  const locale = useLocale()
  const t = useTranslations()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<ImageItem[]>([])
  const { data:categories  } = useServiceCategories()
  const defaultImages = useMemo(()=>service?.images?.map(img=>({...img,"src":genServiceImageUrl(img.src)})) ?? [],[service])
  // Initialize the form with default values
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      id: service?.id,
      categoryId: service?.categoryId,
      nameI18n: service?.nameI18n ?? genEmptyI18nObject([...supportedLocales]),
      type: service?.type ?? "",
      pricingModel: service?.pricingModel ?? "fixed",
      price: service?.price ?? 0,
      estimatedDuration: service?.estimatedDuration ?? "",
      shortDescriptionI18n: service?.shortDescriptionI18n ?? genEmptyI18nObject([...supportedLocales]),
      longDescriptionI18n: service?.longDescriptionI18n ?? genEmptyI18nObject([...supportedLocales]),
      inclusions: service?.inclusions ?? [""],
      features: service?.features ?? [""],
      requirements: service?.requirements ?? [""],
      additionalServices: service?.addOns ?? [{ name: "", price: 0 }],
      standardPriorityFee: service?.standardPriorityFee ?? 0,
      mediumPriorityFee: service?.mediumPriorityFee ?? 0,
      highPriorityFee: service?.highPriorityFee ?? 0,
      isActive: service?.id ? service?.isActive : true,
      images: service?.images ?? []
    },
  })

  // Form submission handler
  async function onSubmit(values: ServiceFormValues) {
    setIsSubmitting(true)
    try {
      const updatedImages = images
        .map((img,idx) => ({...img,sortOrder:idx}))
        .filter(img=>!img.file && img.sortOrder !== form.getValues("images").find(_img=>_img.id === img.id)?.sortOrder)
      const res = await updateService({...values,"images":updatedImages})

      if(res.error) toast.error(res.error)
      else{
        const newImages = images
          .map((image,idx)=>({...image,"sortOrder":idx}))
          .filter(image=>!!image.file)
        const deletedImages = form.getValues("images")
          .filter(img=> !images.find(_img=>_img.id === img.id))
          .map(img=>img.id)
        if(newImages.length > 0 || deletedImages.length > 0){
          const imageFormData = new FormData();
          imageFormData.append("meta", JSON.stringify(newImages.map(img=>({...img,"file":undefined}))));
          for(const img of newImages){
            imageFormData.append("images[]", img.file!);
          }
          for(const img of deletedImages){
            imageFormData.append("deletedImages[]", img);
          }
          await fetch(`/api/services/${res.serviceId}/media`, {
            method: "POST",
            body: imageFormData,
          })
        }
        await queryClient.invalidateQueries({"queryKey":["services"]})
        toast.success(`Category "${getLocalizedValue(values.nameI18n,locale)}" has been ${values.id ? "updated" : "added"} successfully.`)
        form.reset();
        router.push("/admin/services")
      }
    } catch (error) {
        toast.error("Something went wrong, try again later.")
    }
    setIsSubmitting(false)
  }

  // Helper functions for dynamic arrays
  const addItem = (field: "inclusions" | "features" | "requirements") => {
    const currentItems = form.getValues(field)
    form.setValue(field, [...currentItems, ""])
  }

  const removeItem = (field: "inclusions" | "features" | "requirements", index: number) => {
    const currentItems = form.getValues(field)
    form.setValue(
      field,
      currentItems.filter((_, i) => i !== index),
    )
  }

  const addAdditionalService = () => {
    const currentServices = form.getValues("additionalServices")
    form.setValue("additionalServices", [...currentServices, { name: "", price: 0 }])
  }

  const removeAdditionalService = (index: number) => {
    const currentServices = form.getValues("additionalServices")
    form.setValue(
      "additionalServices",
      currentServices.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/admin/services")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>
        <h1 className="text-3xl font-bold">{service?.id ? "Update Service" : "Create New Service"}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Tabs defaultValue="default">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="default">{t('default')}</TabsTrigger>
              <TabsTrigger value="translations">{t('translations')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the core details about this service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`nameI18n.${defaultLanguage}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter service name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className=" w-full">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                categories?.map(category=>(
                                  <SelectItem key={category.id} value={category.id}>{getLocalizedValue(category.nameI18n,locale)}</SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className=" w-full">
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="repair">Repair</SelectItem>
                              <SelectItem value="installation">Installation</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricingModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing Model</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              if (value === "quote") {
                                form.setValue("price", undefined)
                              }
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className=" w-full">
                                <SelectValue placeholder="Select pricing model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed Price</SelectItem>
                              <SelectItem value="quote">Quote Required</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {form.watch("pricingModel") === "fixed" && (
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="estimatedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2-3 hours" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`shortDescriptionI18n.${defaultLanguage}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief service description" className="resize-none" {...field} />
                        </FormControl>
                        <FormDescription>A concise summary that appears in service listings</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`longDescriptionI18n.${defaultLanguage}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Comprehensive service description"
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A detailed explanation of the service that appears on the service detail page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Image Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle>Image Gallery</CardTitle>
                  <CardDescription>Upload images showcasing this service (up to 5 images)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageGallerySelector
                    maxFiles={5}
                    maxSizeMB={1}
                    defaultImages={defaultImages}
                    onChange={setImages}
                  />
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                  <CardDescription>List what's included with this service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.watch("inclusions").map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`inclusions.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <Input placeholder={`Included item ${index + 1}`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => removeItem("inclusions", index)}
                        disabled={form.watch("inclusions").length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" type="button" onClick={() => addItem("inclusions")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Service Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Features</CardTitle>
                  <CardDescription>Highlight the key features of this service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.watch("features").map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`features.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <Input placeholder={`Feature ${index + 1}`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => removeItem("features", index)}
                        disabled={form.watch("features").length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" type="button" onClick={() => addItem("features")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>List any requirements or prerequisites for this service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.watch("requirements").map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`requirements.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <Input placeholder={`Requirement ${index + 1}`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="outline" size="icon" type="button" onClick={() => removeItem("requirements", index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" type="button" onClick={() => addItem("requirements")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Requirement
                  </Button>
                </CardContent>
              </Card>

              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Services</CardTitle>
                  <CardDescription>Add optional services that customers can add to their order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.watch("additionalServices").map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`additionalServices.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <Input placeholder={`Additional service ${index + 1}`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`additionalServices.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="w-24 space-y-0">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Price"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button variant="outline" size="icon" type="button" onClick={() => removeAdditionalService(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" type="button" onClick={addAdditionalService}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Additional Service
                  </Button>
                </CardContent>
              </Card>

              {/* Urgency Levels */}
              <Card>
                <CardHeader>
                  <CardTitle>Urgency Levels & Pricing</CardTitle>
                  <CardDescription>Set pricing for different urgency levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="standardPriorityFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Standard (No Rush)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Base price"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            />
                          </FormControl>
                          <FormDescription>Additional fee for standard priority</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mediumPriorityFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medium Priority</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Additional fee"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            />
                          </FormControl>
                          <FormDescription>Additional fee for medium priority</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="highPriorityFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>High Priority (Rush)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Rush fee"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            />
                          </FormControl>
                          <FormDescription>Additional fee for high priority</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure service availability and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Service</FormLabel>
                          <FormDescription>Make this service available for booking</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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
                    name={`shortDescriptionI18n.${lang}`}
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
          <CardFooter className="flex justify-between">
            <Button disabled={isSubmitting} variant="outline" type="button" onClick={() => router.push("/admin/services")}>
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">{service?.id ? "Update Service" : "Create Service"}</Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  )
}
