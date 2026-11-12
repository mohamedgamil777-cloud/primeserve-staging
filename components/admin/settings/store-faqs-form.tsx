"use client"

import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { insertFAQCategoryTreeSchema } from "@/db/schema/faqCategories"
import { updateStoreFAQs } from "@/actions/store"
import { useState } from "react"

export type FaqFormValues = z.infer<typeof insertFAQCategoryTreeSchema>;


export function StoreFaqsForm({ initialData }: { initialData: Partial<FaqFormValues> }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<FaqFormValues>({
    resolver: zodResolver(insertFAQCategoryTreeSchema),
    defaultValues: initialData,
  })

  const { control, handleSubmit } = form

  const appendCategory = ()=> form.setValue("categories",[...form.getValues("categories"),{"name":"","faqs":[]}])
  const removeCategory = (idx:number)=> form.setValue("categories",form.getValues("categories").filter((cat,_idx)=>idx !== _idx))

  const onSubmit = async (data: FaqFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreFAQs(data)
      if (res.error) toast.error(res.error)
      else if (res.success) toast.success("Store FAQ content saved successfully.")
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>FAQ Management</CardTitle>
            <CardDescription>Manage frequently asked questions and their categories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {form.watch("categories").map((category, categoryIndex) => (
                <div key={categoryIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={control}
                      name={`categories.${categoryIndex}.icon`}
                      render={({ field }) => (
                        <FormItem className="w-full mr-4">
                          <FormLabel>Category Emoji</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? "📦"} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`categories.${categoryIndex}.name`}
                      render={({ field }) => (
                        <FormItem className="w-full mr-4">
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => removeCategory(categoryIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 ml-4">
                    {form.watch(`categories.${categoryIndex}.faqs`).map((faq, faqIndex) => (
                        <div key={`${categoryIndex}-${faqIndex}`} className="border rounded p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">FAQ {faqIndex + 1}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => form.setValue(`categories.${categoryIndex}.faqs`,form.getValues(`categories.${categoryIndex}.faqs`).filter((faq,idx)=>idx !== faqIndex))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <FormField
                            control={control}
                            name={`categories.${categoryIndex}.faqs.${faqIndex}.question`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Question" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`categories.${categoryIndex}.faqs.${faqIndex}.answer`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Answer</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={2} placeholder="Answer" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => form.setValue(`categories.${categoryIndex}.faqs`,[...form.getValues(`categories.${categoryIndex}.faqs`),{ question: "", answer: "" }])}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>
                </div>
              )
            )}

            <Button
              type="button"
              className="w-full"
              onClick={() =>
                appendCategory()
              }
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add FAQ Category
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={isLoading} type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
