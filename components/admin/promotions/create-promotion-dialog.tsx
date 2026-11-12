"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Plus, RefreshCw } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { generateRandomCode } from "@/lib/promotion-utils"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PropsWithChildren, useEffect, useState } from "react"
import { insertPromotionCodeSchema } from "@/db/schema/promotionCodes"
import { useQueryClient } from "@tanstack/react-query"
import { updatePromotionCode } from "@/actions/promotionCode"


type PromotionFormValues = z.infer<typeof insertPromotionCodeSchema>

type CreatePromotionDialogProps = {
  initialData?: Partial<PromotionFormValues> // used for editing
}

export function CreatePromotionDialog({ initialData, children }: PropsWithChildren<CreatePromotionDialogProps>) {
  const queryClient = useQueryClient()
  const [open, setOpen ] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(insertPromotionCodeSchema),
    defaultValues: {
      ...initialData,
      "type":initialData?.type ?? "percentage",
      "startDate":initialData?.startDate ? new Date(initialData?.startDate) : undefined,
      "endDate":initialData?.endDate ? new Date(initialData?.endDate) : undefined,
    },
  })

  useEffect(() => {
    if (initialData && open) {
      form.reset({
        ...form.getValues(),
        ...initialData,
        "startDate":initialData?.startDate ? new Date(initialData?.startDate) : undefined,
        "endDate":initialData?.endDate ? new Date(initialData?.endDate) : undefined,
      })
    }
  }, [initialData, open])

  const onSubmit = async (values: PromotionFormValues) => {
    setIsLoading(true)
    try {
      const res = await updatePromotionCode(values)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["promotions"]})
        toast.success(`Successfully ${initialData ? "updated" : "created"} promotion code "${values.code}"`)
        form.reset()
        setOpen(false)
      }
    } catch (error) {
      toast.error("Something went wrong, try again later")     
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {
          children
          ??
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Promotion
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{initialData ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
              <DialogDescription>
                {initialData ? "Update this promotion code" : "Create a new promotion code for your customers."}
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Code</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.toUpperCase()}
                        className="font-mono uppercase"
                        placeholder="SUMMER25"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => form.setValue("code", generateRandomCode())}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className=" w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("type") !== "shipping" && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{form.watch("type") === "percentage" ? "Percentage" : "Amount"}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {form.watch("type") === "fixed" && <span className="text-sm">$</span>}
                        <Input 
                          {...field} 
                          value={field.value ?? 0} 
                          type="number" 
                          min={0} 
                          max={form.watch("type") === "percentage" ? 100 : undefined} 
                          onChange={(e)=>field.onChange(parseFloat(e.target.value))}
                        />
                        {form.watch("type") === "percentage" && <span className="text-sm">%</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Summer sale discount" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minPurchase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Purchase</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$</span>
                      <Input 
                        {...field} 
                        value={field.value ?? 0} 
                        type="number" 
                        min={0} placeholder="0" 
                        onChange={(e)=>field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value ?? 0} 
                      type="number" 
                      min={0} 
                      placeholder="Leave empty or set to zero for unlimited" 
                      onChange={(e)=>field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {["startDate", "endDate"].map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name as "startDate" | "endDate"}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{name === "startDate" ? "Start Date" : "End Date"}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : name === "startDate" ? "Select date" : "No expiry date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) =>
                            name === "endDate" && form.getValues("startDate")
                              ? date < form.getValues("startDate")!
                              : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div>
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      {field.value ? "Promotion is active" : "Promotion is inactive"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={isLoading} type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">{initialData ? "Update" : "Create Promotion"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
