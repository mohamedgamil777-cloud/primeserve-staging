"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Clock, CreditCard } from "lucide-react"
import { toast } from "sonner"
import AddressSelector from "@/components/address/address-selector"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { insertServiceRequestSchema, serviceBudgets, serviceTimeLines } from "@/db/schema/serviceRequests"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ExistingService } from "@/types/services"
import { updateServiceRequest } from "@/actions/serviceRequest"
import { useRouter } from "next/navigation"
import { useLocale } from "@/hooks/use-locale"
import { getLocalizedValue } from "@/types/internationalization"

type Props = {
  service:Pick<ExistingService,"longDescriptionI18n"|"nameI18n"|"id"|"addOns"|"estimatedDuration"|"price"|"standardPriorityFee"|"mediumPriorityFee"|"highPriorityFee">
}

export default function BookServicePage({service}:Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const locale = useLocale()

  const form = useForm<z.infer<typeof insertServiceRequestSchema>>({
    resolver: zodResolver(insertServiceRequestSchema),
    defaultValues: {
      serviceId: service?.id,
      description: '',
      budget: "under-1k",
      timeline: "1-week",
      contactMethod: 'email',
      urgency: 'medium',
      desiredDaytime: "morning",
      addtionalServiceIds:[]
    },
  })


  const handleAddonChange = (addonId: string, checked: boolean) => {
    if (checked) {
      form.setValue("addtionalServiceIds",[...(form.watch("addtionalServiceIds") ?? []), addonId])
    } else {
      form.setValue("addtionalServiceIds",(form.watch("addtionalServiceIds") ?? []).filter((id) => id !== addonId))
    }
  }

  const calculateTotal = () => {
    let total = service.price ?? 0
    form.watch("addtionalServiceIds")?.forEach((addonId) => {
      const addon = service.addOns.find((a) => a.id === addonId)
      if (addon) total += addon.price
    })
    if(form.watch("urgency") === "high") total += service.highPriorityFee
    else if(form.watch("urgency") === "medium") total += service.mediumPriorityFee
    else if(form.watch("urgency") === "low") total += service.standardPriorityFee
    return total
  }

  const handleSubmit = async (values: z.infer<typeof insertServiceRequestSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await updateServiceRequest(values)
      if(res.error) toast.error(res.error)
      else{
        toast.success("Service request submitted successfully! We'll contact you within 24 hours to confirm.")
        form.reset()
        router.push("/services")
      }
    } catch (error) {
        toast.error("Something went wrong, try again later.")
    }
    setIsSubmitting(false)
    
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Service</h1>
          <p className="text-muted-foreground">Schedule your {getLocalizedValue(service.nameI18n,locale)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Address</CardTitle>
                    <CardDescription>Where should we perform the service?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="addressId"
                      render={({ field }) => (
                        <FormItem>
                          <AddressSelector
                            className="md:grid-cols-2"
                            onSelect={field.onChange}
                            defaultAddressId={field.value}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
    
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>Tell us about your specific requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please describe your project in detail..."
                              rows={6}
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Budget Range</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className=' w-full'>
                                  <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(serviceBudgets).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
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
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Desired Timeline</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className=' w-full'>
                                  <SelectValue placeholder="Select timeline" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(serviceTimeLines).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
    
                    <FormField
                      control={form.control}
                      name="desiredDaytime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Time of Day</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className=' w-full'>
                                <SelectValue placeholder="Select preferred time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="morning">Morning (8AM–12PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12PM–4PM)</SelectItem>
                              <SelectItem value="evening">Evening (4PM–8PM)</SelectItem>
                              <SelectItem value="anytime">Anytime</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Contact Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="mt-2"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="email-contact" />
                                <Label htmlFor="email-contact">Email</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="phone" id="phone-contact" />
                                <Label htmlFor="phone-contact">Phone</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="both" id="both-contact" />
                                <Label htmlFor="both-contact">Either</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
    
                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Urgency</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="mt-2"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="low" id="urgency-low" />
                                <Label htmlFor="urgency-low">Low - Planning phase</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="urgency-medium" />
                                <Label htmlFor="urgency-medium">Medium - Start in a month</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="high" id="urgency-high" />
                                <Label htmlFor="urgency-high">High - Urgent</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Additional Services */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Services</CardTitle>
                    <CardDescription>Add extra services to your booking</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {service.addOns.map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={addon.id}
                            checked={form.watch("addtionalServiceIds")?.includes(addon.id)}
                            onCheckedChange={(checked) => handleAddonChange(addon.id, checked as boolean)}
                          />
                          <Label htmlFor={addon.id} className="font-medium">
                            {addon.name}
                          </Label>
                        </div>
                        <span className="font-semibold">+${addon.price}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Button disabled={isSubmitting} type="submit" size="lg" className="w-full">
                  Submit Service Request
                </Button>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{getLocalizedValue(service.nameI18n,locale)}</span>
                    <span>${service.price}</span>
                  </div>

                  {form.watch("addtionalServiceIds")?.map((addonId) => {
                    const addon = service.addOns.find((a) => a.id === addonId)
                    return addon ? (
                      <div key={addon.id} className="flex justify-between text-sm">
                        <span>{addon.name}</span>
                        <span>+${addon.price}</span>
                      </div>
                    ) : null
                  })}

                
                  <div className="flex justify-between text-sm">
                    <span>Rush fee</span>
                    <span>+${
                        form.watch("urgency") === "high"
                        ?
                        service.highPriorityFee
                        :
                        form.watch("urgency") === "medium"
                        ?
                        service.mediumPriorityFee
                        :
                        service.standardPriorityFee
                      }
                    </span>
                  </div>
                  
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {service.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment due after service</span>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">What happens next?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• We'll confirm your booking within 24 hours</li>
                    <li>• Technician will call 30 minutes before arrival</li>
                    <li>• Payment is collected after service completion</li>
                    <li>• 90-day warranty on all installations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
