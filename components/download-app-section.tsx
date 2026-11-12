import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function DownloadAppSection() {
  const t = useTranslations()
  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t('shop-smarter-with-our-mobile-app')}
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                {t('download-our-app-for-a-seamless-shopping-experience-get-exclusive-deals-and-manage-your-orders-on-the-go')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{t('exclusive-app-only-deals')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('get-access-to-special-discounts-only-available-on-our-app')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{t('faster-checkout')}</p>
                  <p className="text-sm text-muted-foreground">{t('save-your-details-for-quick-and-easy-purchases')}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{t('real-time-order-tracking')}</p>
                  <p className="text-sm text-muted-foreground">{t('follow-your-order-from-checkout-to-delivery')}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="h-14 px-6 bg-black text-white hover:bg-black/90 flex items-center gap-2">
                <Image
                  src="/placeholder.png?height=24&width=24"
                  alt={t('app-store')}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div className="flex flex-col items-start">
                  <span className="text-xs">{t('download-on-the')}</span>
                  <span className="text-sm font-medium">{t('app-store')}</span>
                </div>
              </Button>

              <Button className="h-14 px-6 bg-black text-white hover:bg-black/90 flex items-center gap-2">
                <Image
                  src="/placeholder.png?height=24&width=24"
                  alt={t('google-play')}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div className="flex flex-col items-start">
                  <span className="text-xs">{t('get-it-on')}</span>
                  <span className="text-sm font-medium">{t('google-play')}</span>
                </div>
              </Button>
            </div>

            <Button variant="link" className="px-0 flex items-center gap-1">
              {t('learn-more-about-our-app')} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="relative h-[500px] flex items-center justify-center">
            <div className="absolute transform -rotate-6 shadow-xl rounded-3xl overflow-hidden border border-border">
              <Image
                src="/placeholder.png?height=500&width=250"
                alt={t('mobile-app-screenshot')}
                width={250}
                height={500}
                className="h-[500px] w-[250px] object-cover"
              />
            </div>
            <div className="absolute transform rotate-6 shadow-xl rounded-3xl overflow-hidden border border-border">
              <Image
                src="/placeholder.png?height=500&width=250"
                alt={t('mobile-app-screenshot')}
                width={250}
                height={500}
                className="h-[500px] w-[250px] object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-white p-4 rounded-lg shadow-lg flex items-center gap-2 z-10">
              <Image
                src="/placeholder.png?height=80&width=80"
                alt={t('qr-code')}
                width={80}
                height={80}
                className="h-20 w-20"
              />
              <div className="text-sm">
                <p className="font-medium">{t('scan-to-download')}</p>
                <p className="text-muted-foreground">{t('ios-and-android')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
