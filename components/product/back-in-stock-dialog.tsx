"use client"

import { PropsWithChildren, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Check, Bell } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductItem } from "@/types/product"
import { genProductImageUrl } from "@/lib/product"
import { insertProductStockSubscriptionSchema } from "@/db/schema/productStockSubscriptions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { useCurrentUser } from "@/hooks/use-current-user"
import { setupProductBackInStockReminder } from "@/actions/product"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useLocale } from "@/hooks/use-locale"
import { getLocalizedValue } from "@/types/internationalization"

type BackInStockFormData = z.infer<typeof insertProductStockSubscriptionSchema>

interface BackInStockDialogProps {
  product: ProductItem
}

export function BackInStockDialog({ product, children }: PropsWithChildren<BackInStockDialogProps>) {
  const t = useTranslations()
  const locale = useLocale()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { data:session } = useCurrentUser()

  const form = useForm<BackInStockFormData>({
    resolver: zodResolver(insertProductStockSubscriptionSchema),
    defaultValues: {
      notifyBy: "email",
      "productId":product.id
    },
  })

  const onSubmit = async (data: BackInStockFormData) => {
    if(data.notifyBy === "email" && !data.email && !session?.id) return toast.error(t('email-is-required-if-you-want-to-be-notified-by-email'))
		if(data.notifyBy === "sms" && !data.phone && !session?.id) return toast.error(t('phone-is-required-if-you-want-to-be-notified-by-phone'))

    setIsLoading(true)

    try {
      const res = await setupProductBackInStockReminder(data)
      if(res.error) toast.error(res.error)
      else if(res.success){      
        setIsSuccess(true)
        toast.success(t('youll-be-notified-when-this-item-is-back-in-stock'))
        await queryClient.invalidateQueries({"queryKey":["active-product-reminders"]})
        // Close dialog after a short delay
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          form.reset()
        }, 2000)
      }
    } catch (error) {
      toast.error(t('something-went-wrong-please-try-again'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsSuccess(false)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {
          children
          ??
          <Button
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm cursor-pointer"
          >
            <Bell className="h-4 w-4 mr-2" />
            {t('notify-me')}
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[98%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('back-in-stock-notification')}
          </DialogTitle>
          <DialogDescription>{t('get-notified-when-this-item-is-available-again')}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <img
            src={genProductImageUrl(product.mainImage)}
            alt={getLocalizedValue(product.nameI18n,locale)}
            className="h-16 w-16 object-cover rounded-md"
          />
          <div className="flex-1">
            <h4 className="font-medium line-clamp-1">{getLocalizedValue(product.nameI18n,locale)}</h4>
            <p className="text-sm text-muted-foreground">EGP {product.price.toFixed(2)}</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">{t('youre-all-set')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('well-notify-you-as-soon-as-this-item-is-back-in-stock')}
              </p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {
                !session?.id
                &&
                <>                
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email-address-1')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enter-your-email')} type="email" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
    
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('phone-number-optional')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enter-your-phone-number')} type="tel" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              }

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="notifyBy"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t('notify-me-about')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="email" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <div className="space-y-1 leading-none">
                                <FormLabel>{t('email-notifications-0')}</FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  {t('receive-email-alerts-when-this-item-is-back-in-stock')}
                                </p>
                              </div>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem disabled value="phone" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <div className="space-y-1 leading-none">
                                <FormLabel>{t('sms-notifications')}</FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  {t('receive-text-message-alerts-phone-number-required')}
                                </p>
                              </div>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Label>{t('more-options')}</Label>
                <FormField
                  control={form.control}
                  name="addToCart"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">      
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t('add-to-cart')}</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          {t('add-this-item-to-your-cart-when-it-is-back-in-stock')}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="smsNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>SMS notifications</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Receive text message alerts (phone number required)
                        </p>
                      </div>
                    </FormItem>
                  )}
                /> */}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isLoading}>
                  {t('cancel')}
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      {t('notify-me')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
