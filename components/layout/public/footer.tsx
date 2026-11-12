import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import MadeByCodmium from "./made-by-codmium"
import { getTranslations } from "next-intl/server"

export async function Footer({locale}:{locale:string}) {
  const t = await getTranslations({locale})
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">PrimeServe</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t('discover-our-latest-advisory-services-and-supplies-tailored-for-your-bussiness')}
            </p>
            <div className="flex space-x-4">
              <Link href={`/${locale}/#`} className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">{t('facebook')}</span>
              </Link>
              <Link href={`/${locale}/#`} className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">{t('instagram')}</span>
              </Link>
              <Link href={`/${locale}/#`} className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">{t('twitter')}</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('shop')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/products`} className="text-muted-foreground hover:text-primary">
                  {t('all-products')}
                </Link>
              </li>
              {/* <li>
                <Link href="/categories/men" className="text-muted-foreground hover:text-primary">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/categories/women" className="text-muted-foreground hover:text-primary">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/categories/accessories" className="text-muted-foreground hover:text-primary">
                  Accessories
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/about`} className="text-muted-foreground hover:text-primary">
                  {t('about-us')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-primary">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/careers`} className="text-muted-foreground hover:text-primary">
                  {t('careers')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-muted-foreground hover:text-primary">
                  {t('blog')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('customer-service')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/help`} className="text-muted-foreground hover:text-primary">
                  {t('help-center')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping`} className="text-muted-foreground hover:text-primary">
                  {t('shipping-and-returns')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-muted-foreground hover:text-primary">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-primary">
                  {t('privacy-policy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PrimeServe. All rights reserved.</p>
        </div> */}
      </div>
      <MadeByCodmium locale={locale}/>
    </footer>
  )
}
