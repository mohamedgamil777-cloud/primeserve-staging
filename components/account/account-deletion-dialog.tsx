"use client"
import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Textarea } from "../ui/textarea"
import { scheduleAccountForDeletion } from "@/actions/user"
import { useTranslations } from "next-intl"

export function AccountDeletionDialog() {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [step, setStep] = useState(1)

  const deletionReasons = [
    { value: "privacy", label: t('privacy-concerns') },
    { value: "not-using", label: t('not-using-the-service-anymore') },
    { value: "too-expensive", label: t('too-expensive') },
    { value: "poor-service", label: t('poor-customer-service') },
    { value: "technical-issues", label: t('technical-issues') },
    { value: "found-alternative", label: t('found-a-better-alternative') },
    { value: "other", label: t('other-please-specify') },
  ]

  const handleSubmitDeletion = async () => {
    setIsLoading(true)
    try {
      const res = await scheduleAccountForDeletion({reason,customReason})
      if(res.error) toast.error(res.error)
      if(res.success) toast.success(t('your-account-has-been-scheduled-for-deletion-youll-receive-an-email-with-further-details'))
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setOpen(false)
    setStep(1)
    setIsLoading(false)
  }

  const resetDialog = () => {
    setStep(1)
    setReason("")
    setCustomReason("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetDialog()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          {t('delete-account')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                {t('delete-your-account')}
              </DialogTitle>
              <DialogDescription>
                {t('were-sorry-to-see-you-go-please-help-us-understand-why-youre-leaving')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">{t('why-are-you-deleting-your-account')}</Label>
                <RadioGroup value={reason} onValueChange={setReason}>
                  {deletionReasons.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {reason === "other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customReason">{t('please-specify')}</Label>
                    <Textarea
                      id="customReason"
                      placeholder={t('tell-us-more-about-your-reason-for-leaving')}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={() => setStep(2)} disabled={!reason || (reason === "other" && !customReason.trim())}>
                {t('continue')}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-destructive">{t('what-happens-when-you-delete-your-account')}</DialogTitle>
              <DialogDescription>{t('please-review-what-will-happen-to-your-data-and-account-access')}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h4 className="font-semibold text-destructive mb-2">{t('this-action-cannot-be-undone')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('once-your-account-is-deleted-you-wont-be-able-to-recover-your-data-or-reactivate-your-account')}
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-destructive">{t('what-will-be-deleted')}</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{t('your-profile-information-and-account-details')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{t('order-history-and-purchase-records')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{t('wishlist-items-and-saved-products')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{t('reward-points-and-loyalty-benefits')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{t('product-reviews-and-ratings')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{t('saved-addresses-and-payment-methods')}</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('what-happens-to-pending-orders')}</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{t('pending-orders-will-be-cancelled-and-refunded')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{t('shipped-orders-will-continue-to-be-delivered')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{t('you-can-still-return-items-within-our-return-policy')}</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('data-retention-for-legal-purposes')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('some-transaction-records-may-be-retained-for-tax-and-legal-compliance-purposes-as-required-by-law')}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">{t('deletion-timeline')}</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>{t("today")}:</strong> {t('account-scheduled-for-deletion')}
                  </p>
                  <p>
                    <strong>{t('30-days')}</strong> {t('grace-period-to-cancel-deletion')}
                  </p>
                  <p>
                    <strong>{t('after-30-days')}</strong> {t('account-permanently-deleted')}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">{t('want-to-keep-your-data')}</h4>
                <p className="text-sm text-green-700 mb-3">
                  {t('you-can-download-a-copy-of-your-data-before-deletion-this-includes-your-order-history-profile-information-and-other-account-data')}
                </p>
                <Button variant="outline" size="sm" className="text-green-700 border-green-300">
                  {t('download-my-data')}
                </Button>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button disabled={isLoading} variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto">
                {t('back')}
              </Button>
              <Button disabled={isLoading} variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                {t('cancel')}
              </Button>
              <Button disabled={isLoading} variant="destructive" onClick={handleSubmitDeletion} className="w-full sm:w-auto">
                {t('schedule-account-deletion')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
