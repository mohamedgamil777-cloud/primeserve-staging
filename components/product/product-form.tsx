"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Upload, X, Plus, MoreVertical, Copy, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { insertProductSchema } from "@/db/schema/products"
import { useCategories } from "@/hooks/use-categories"
import { ImageUpload } from "@/components/image-upload"
import { ExistingProduct } from "@/types/product"
import { updateProduct } from "@/actions/product"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { genEmptyI18nObject, getLocalizedValue, supportedLocales } from "@/types/internationalization"
import { useTranslations } from "next-intl"
import { useLocale } from "@/hooks/use-locale"


type ProductFormValues = z.infer<typeof insertProductSchema>


export default function ProductForm({product}:{product?:Partial<ExistingProduct>}) {
  const locale = useLocale() 
  const t = useTranslations() 
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data:categories } = useCategories()
  const isEditMode = !!product?.id

  const [images, setImages] = useState<string[]>(isEditMode ? [] : [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newVariantType, setNewVariantType] = useState("")
  const [newVariantOption, setNewVariantOption] = useState("")
  const [selectedVariantType, setSelectedVariantType] = useState<string | null>(null)
  const [isAddingVariantType, setIsAddingVariantType] = useState(false)
  const [isAddingVariantOption, setIsAddingVariantOption] = useState(false)
  const [selectAllVariants, setSelectAllVariants] = useState(false)

  // Initialize form with default values or existing product data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      id:product?.id,
      nameI18n: product?.nameI18n ?? genEmptyI18nObject([...supportedLocales]),
      descriptionI18n: product?.descriptionI18n ?? genEmptyI18nObject([...supportedLocales]),
      price: product?.price ?? 0,
      categoryId: product?.categoryId,
      subcategoryId: product?.subcategoryId,
      discountPercentage: product?.discountPercentage ?? 0,
      isNew: product?.isNew,
      stock: product?.stock ?? 0,
      variantTypes: [],
      variantCombinations: [],
    },
  })

  const {
    fields: variantTypeFields,
    append: appendVariantType,
    remove: removeVariantType,
  } = useFieldArray({
    control: form.control,
    name: "variantTypes",
  })

  const {
    fields: variantCombinationFields,
    append: appendVariantCombination,
    remove: removeVariantCombination,
  } = useFieldArray({
    control: form.control,
    name: "variantCombinations",
  })

  // Generate all possible variant combinations when variant types change
  useEffect(() => {
    const variantTypes = form.getValues("variantTypes") || []
    if (variantTypes.length === 0) return

    // Generate all possible combinations
    const generateCombinations = (
      types: { name: string; options: string[] }[],
      current: Record<string, string> = {},
      index = 0,
    ): Record<string, string>[] => {
      if (index === types.length) {
        return [current]
      }

      const type = types[index]
      const combinations: Record<string, string>[] = []

      for (const option of type.options) {
        const newCombination = { ...current, [type.name]: option }
        combinations.push(...generateCombinations(types, newCombination, index + 1))
      }

      return combinations
    }

    const allCombinations = generateCombinations(variantTypes)

    // Get existing combinations
    const existingCombinations = form.getValues("variantCombinations") || []

    // Create new combinations that don't exist yet
    const newCombinations = allCombinations.filter((newCombo) => {
      return !existingCombinations.some((existing) => {
        return Object.keys(newCombo).every((key) => existing.combination[key] === newCombo[key])
      })
    })

    // Add new combinations to the form
    newCombinations.forEach((combo) => {
      appendVariantCombination({
        id: `new-${Math.random().toString(36).substr(2, 9)}`,
        combination: combo,
        price: form.getValues("price"),
        stock: 0,
        sku: "",
        barcode: "",
        isActive: true,
      })
    })
  }, [form.watch("variantTypes")])


  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true)
    try {
      const res = await updateProduct({...values,"mainImage":""})
      if(res.error) toast.error(res.error)
      else{
        if(values.mainImage){
          const imageFormData = new FormData();
          imageFormData.append("image", values.mainImage);
          await fetch(`/api/products/${res.productId}/media`, {
            method: "POST",
            body: imageFormData,
          })
        }
        await queryClient.invalidateQueries({"queryKey":["products"]})
        toast.success(`Product "${values.nameI18n[locale]}" has been ${values.id ? "updated" : "added"} successfully.`)
        form.reset();
        router.push("/admin/products")
      }
    } catch (error) {
        toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsSubmitting(false)
  }



  function handleImageUpload() {
    setImages([...images, `/placeholder.png?height=600&width=400&text=Image ${images.length + 1}`])
  }

  function removeImage(index: number) {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  function addVariantType() {
    if (!newVariantType) return

    appendVariantType({
      name: newVariantType,
      options: [],
    })

    setNewVariantType("")
    setIsAddingVariantType(false)
  }

  function addVariantOption() {
    if (!selectedVariantType || !newVariantOption) return

    const variantTypes = form.getValues("variantTypes") || []
    const updatedVariantTypes = variantTypes.map((type) => {
      if (type.name === selectedVariantType) {
        return {
          ...type,
          options: [...type.options, newVariantOption],
        }
      }
      return type
    })

    form.setValue("variantTypes", updatedVariantTypes)
    setNewVariantOption("")
    setIsAddingVariantOption(false)
  }

  function handleSelectAllVariants(checked: boolean) {
    setSelectAllVariants(checked)
  }

  function bulkDeleteVariants() {
    // In a real app, this would delete the selected variants
    console.log("Bulk delete variants")
  }

  function bulkUpdateStock() {
    // In a real app, this would update the stock of selected variants
    console.log("Bulk update stock")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? t('edit-product') : t('add-new-product')}</h1>
          <p className="text-muted-foreground">
            {isEditMode ? t('update-product-information') : t('create-a-new-product-listing')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            {t('cancel')}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit,(err)=>console.log(err))} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? t('update-product') : t('create-product')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger disabled value="images">{t('images')}</TabsTrigger>
          <TabsTrigger disabled value="variants">{t('variants')}</TabsTrigger>
          <TabsTrigger disabled value="seo">SEO</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">

                  {/* Name Field */}
                  {supportedLocales.map((locale) => (
                    <FormField
                      key={locale}
                      control={form.control}
                      name={`nameI18n.${locale}`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm font-medium">
                              {t("product-name")} [{t(locale)}]
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
                  


                  {/* Description Field */}
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
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('discount')} (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('mark-as-new')}</FormLabel>
                          <FormDescription>{t('display-a-new-badge-on-this-product')}</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="mainImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('product-image-optional')}</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => form.setValue("mainImage", "")}
                          aspectRatio="logo"
                          label={t('upload-logo')}
                          description={t('drag-and-drop-or-click-to-upload-your-product-logo')}
                          maxSizeMB={2}
                          defaultImgPreview={product?.mainImage ? `/api/imgs/products/${product.mainImage}` :  undefined}
                        />
                      </FormControl>
                      <FormDescription>{t('recommended-size-400x400px-png-or-jpg-format')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-6 md:grid-cols-2">

              </div>


              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className=" w-full">
                            <SelectValue placeholder={t('select-a-category')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {getLocalizedValue(category.nameI18n,locale)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('subcategory')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className=" w-full">
                            <SelectValue placeholder={t('select-a-subcategory')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.find(cat=>cat.id === form.watch("categoryId"))?.subcategories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {getLocalizedValue(category.nameI18n,locale)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('base-price')} ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('this-is-the-default-price-variant-specific-prices-can-be-set-in-the-variants-tab')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('stock')}</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} value={field.value ?? 0} onChange={(e)=>form.setValue("stock",parseInt(e.target.value))}/>
                      </FormControl>
                      <FormDescription>
                        {t('this-is-the-default-stock-variant-specific-stocks-can-be-set-in-the-variants-tab')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('product-images')}</h3>
                <Button type="button" onClick={handleImageUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('upload-image')}
                </Button>
              </div>

              {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">{t('no-images-uploaded')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t('upload-images-to-showcase-your-product')}</p>
                  <Button type="button" onClick={handleImageUpload}>
                    {t('upload-image')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative aspect-square">
                        <img
                          src={image || "/placeholder.png"}
                          alt={`${t('product-image')} ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {index === 0 && <Badge className="absolute top-2 left-2">{t('main-image')}</Badge>}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <Card>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{t('variant-types')}</h3>
                    <Button type="button" onClick={() => setIsAddingVariantType(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('add-variant-type')}
                    </Button>
                  </div>

                  {variantTypeFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <h3 className="text-base font-medium">No variant types defined</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add variant types like Size, Color, Material, etc.
                      </p>
                      <Button type="button" onClick={() => setIsAddingVariantType(true)}>
                        Add Variant Type
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {variantTypeFields.map((field, index) => {
                        const variantType = form.getValues(`variantTypes.${index}`)
                        if(!variantType) return null
                        return (
                          <div key={field.id} className="rounded-lg border">
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{variantType.name}</h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVariantType(variantType.name)
                                    setIsAddingVariantOption(true)
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Option
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {variantType.options.map((option, optionIndex) => (
                                  <Badge key={optionIndex} variant="secondary" className="px-3 py-1">
                                    {option}
                                  </Badge>
                                ))}
                                {variantType.options.length === 0 && (
                                  <p className="text-sm text-muted-foreground">No options added yet</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Add Variant Type Dialog */}
                  <Dialog open={isAddingVariantType} onOpenChange={setIsAddingVariantType}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Variant Type</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="variant-type">Variant Type Name</Label>
                          <Input
                            id="variant-type"
                            placeholder="e.g., Size, Color, Material"
                            value={newVariantType}
                            onChange={(e) => setNewVariantType(e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Enter a name for this variant type, like "Size" or "Color"
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddingVariantType(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addVariantType} disabled={!newVariantType}>
                          Add Variant Type
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Add Variant Option Dialog */}
                  <Dialog open={isAddingVariantOption} onOpenChange={setIsAddingVariantOption}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Option to {selectedVariantType}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="variant-option">Option Value</Label>
                          <Input
                            id="variant-option"
                            placeholder="e.g., Small, Red, Cotton"
                            value={newVariantOption}
                            onChange={(e) => setNewVariantOption(e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Enter a value for this option, like "Small" for Size or "Red" for Color
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddingVariantOption(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addVariantOption} disabled={!newVariantOption}>
                          Add Option
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>

              {variantTypeFields.length > 0 && (
                <Card>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Variant Combinations</h3>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={bulkUpdateStock} disabled={!selectAllVariants}>
                          Update Stock
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={bulkDeleteVariants}
                          disabled={!selectAllVariants}
                        >
                          Delete Selected
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox checked={selectAllVariants} onCheckedChange={handleSelectAllVariants} />
                            </TableHead>
                            {variantTypeFields.map((field) => (
                              <TableHead key={field.id}>
                                {form.getValues(`variantTypes.${variantTypeFields.indexOf(field)}`)?.name}
                              </TableHead>
                            ))}
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Barcode</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variantCombinationFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              {variantTypeFields.map((variantField) => {
                                const variantType = form.getValues(
                                  `variantTypes.${variantTypeFields.indexOf(variantField)}`,
                                )?.name
                                return (
                                  <TableCell key={variantField.id}>
                                    {form.getValues(`variantCombinations.${index}.combination.${variantType}`)}
                                  </TableCell>
                                )
                              })}
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...form.register(`variantCombinations.${index}.price`)}
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  {...form.register(`variantCombinations.${index}.stock`)}
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                <Input {...form.register(`variantCombinations.${index}.sku`)} className="w-24" />
                              </TableCell>
                              <TableCell>
                                <Input {...form.register(`variantCombinations.${index}.barcode`)} className="w-24" />
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input id="meta-title" placeholder="Meta title for SEO" />
                </div>
                <div>
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea id="meta-description" placeholder="Meta description for SEO" className="min-h-[80px]" />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input id="keywords" placeholder="Comma-separated keywords" />
                </div>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
