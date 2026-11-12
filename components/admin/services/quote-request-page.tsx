'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import AddressSelector from '@/components/address/address-selector'
import { insertServiceRequestSchema, serviceBudgets, serviceTimeLines } from '@/db/schema/serviceRequests'
import { WrenchIcon } from 'lucide-react'
import { ExistingService } from '@/types/services'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateServiceRequest } from '@/actions/serviceRequest'
import { useTranslations } from 'next-intl'
import { localizeContent } from '@/lib/content-ar'
import { getLocalizedValue } from '@/types/internationalization'
import { useLocale } from '@/hooks/use-locale'

type Props = {
  service:Pick<ExistingService,"longDescriptionI18n"|"nameI18n"|"id">
}

export default function QuoteRequestPage({service}:Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

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

  const onSubmit = async (values: z.infer<typeof insertServiceRequestSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await updateServiceRequest(values)
      if(res.error) toast.error(res.error)
      else{
        toast.success(t('quote-request-submitted-well-contact-you-within-24-hours-with-a-detailed-estimate'))
        form.reset()
        router.push("/services")
      }
    } catch (error) {
        toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('request-a-custom-quote')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('get-a-personalized-estimate-for-your-project-our-experts-will-review-your-requirements-and-provide-a-detailed-quote-within-24-hours')}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>{t('service-type')}</CardTitle>
                <CardDescription>{t('what-type-of-service-do-you-need')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            "border-primary bg-primary/5"
                        }`}
                        >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                            <WrenchIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                            <h3 className="font-semibold mb-1">{getLocalizedValue(service.nameI18n,locale)}</h3>
                            <p className="text-sm text-muted-foreground">{getLocalizedValue(service.longDescriptionI18n,locale)}</p>
                            </div>
                            <div className="mt-1">
                            <div
                                className={`w-4 h-4 rounded-full border-2 border-primary bg-primary`}
                            />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            
            <Card>
              <CardHeader>
                <CardTitle>{t('project-address')}</CardTitle>
                <CardDescription>{t('where-should-we-perform-the-service')}</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="addressId"
                  render={({ field }) => (
                    <FormItem>
                      <AddressSelector
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
                <CardTitle>{t('project-details')}</CardTitle>
                <CardDescription>{t('tell-us-about-your-specific-requirements')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('project-description')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('please-describe-your-project-in-detail')}
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
                        <FormLabel>{t('estimated-budget-range')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className=' w-full'>
                              <SelectValue placeholder={t('select-budget-range')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(serviceBudgets).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {localizeContent(label, locale)}
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
                        <FormLabel>{t('desired-timeline')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className=' w-full'>
                              <SelectValue placeholder={t('select-timeline')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(serviceTimeLines).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {localizeContent(label, locale)}
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
                      <FormLabel>{t('desired-time-of-day')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className=' w-full'>
                            <SelectValue placeholder={t('select-preferred-time')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="morning">{t('morning-8am-12pm')}</SelectItem>
                          <SelectItem value="afternoon">{t('afternoon-12pm-4pm')}</SelectItem>
                          <SelectItem value="evening">{t('evening-4pm-8pm')}</SelectItem>
                          <SelectItem value="anytime">{t('anytime')}</SelectItem>
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
                      <FormLabel>{t('preferred-contact-method')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="mt-2"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email-contact" />
                            <Label htmlFor="email-contact">{t('email')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="phone-contact" />
                            <Label htmlFor="phone-contact">{t('phone')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both-contact" />
                            <Label htmlFor="both-contact">{t('either')}</Label>
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
                      <FormLabel>{t('project-urgency')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="mt-2"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="urgency-low" />
                            <Label htmlFor="urgency-low">{t('low-planning-phase')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="urgency-medium" />
                            <Label htmlFor="urgency-medium">{t('medium-start-in-a-month')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="urgency-high" />
                            <Label htmlFor="urgency-high">{t('high-urgent')}</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>{t("ui.supportingDocs")}</CardTitle>
                <CardDescription>{t("ui.supportingDocsText")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">{t("ui.dragDrop")}</p>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                  </p>
                  <Button variant="outline" className="mt-4">{t("ui.chooseFiles")}</Button>
                </div>
              </CardContent>
            </Card> */}

            <Card>
              <CardContent className="pt-6">
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">{t('what-happens-next')}</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>{t('well-review-your-request-within-24-hours')}</li>
                    <li>{t('our-expert-will-contact-you-to-discuss-details')}</li>
                    <li>{t('well-schedule-a-site-visit-if-needed-free')}</li>
                    <li>{t('youll-receive-a-detailed-quote-with-timeline')}</li>
                    <li>{t('no-obligation-quotes-are-completely-free')}</li>
                  </ul>
                </div>
                <Button disabled={isSubmitting} type="submit" size="lg" className="w-full">
                  {t('submit-quote-request')}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  )
}
