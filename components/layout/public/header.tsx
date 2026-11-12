"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { CartPreview } from "@/components/cart/cart-preview"
import logo from "@/public/imgs/logo.png"
import Image from "next/image"
import { useCurrentUser } from "@/hooks/use-current-user"
import LanguageSwitcher from "@/components/languages/language-switcher"
import { useLocale, useTranslations } from "next-intl"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { data } = useCurrentUser()
  const t = useTranslations()
  const locale = useLocale()

  const routes = [
    {
      href: `/${locale}/`,
      label: t('home'),
      active: pathname === `/${locale}/`,
    },
    // {
    //   href: `${locale}/products`,
    //   label: "Products",
    //   active: pathname === `${locale}/products`,
    // },
    {
      label: t('services'),
      href: `/${locale}/services`,
      active: pathname === `/${locale}/services`,
    },
    {
      href: `/${locale}/categories`,
      label: t('supplies'),
      active: pathname === `/${locale}/categories`,
    },
    {
      href: `/${locale}/about`,
      label: t('about'),
      active: pathname === `/${locale}/about`,
    },
    {
      href: `/${locale}/support`,
      label: t('supportHub.nav'),
      active: pathname === `/${locale}/support`,
    },
    {
      href: `/${locale}/contact`,
      label: t('contact'),
      active: pathname === `/${locale}/contact`,
    },
  ]

  return (
    <header dir={locale === "ar" ? "rtl" : "ltr"} className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto justify-between">
        <Link href={`/${locale}/`} className="ml-6 flex items-center space-x-2">
          <Image height={40} src={logo} alt="PrimeServe"/>
        </Link>
        <nav className="hidden ml-auto md:flex md:flex-1 md:items-center md:justify-center">
          <ul className="flex gap-6">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className=" flex flex-row gap-2">
          <div className="flex items-center justify-end space-x-4">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative flex items-center"
              >
                <Input
                  type="search"
                  placeholder={t('search-products')}
                  className="w-full"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden md:flex">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">{t('search')}</span>
                </Button>
                <ModeToggle />
                <LanguageSwitcher/>
                <Link href={!data?.role ? `/${locale}/auth/login` : data.role === "seller" ? `/${locale}/admin` : `/${locale}/account`}>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('account')}</span>
                  </Button>
                </Link>
                <CartPreview />
              </>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('toggle-menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0 p-4">
              <MobileNav routes={routes} />
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}

function MobileNav({ routes }: { routes: { href: string; label: string; active: boolean }[] }) {
  return (
    <div className="flex flex-col gap-6 text-lg font-medium">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </div>
  )
}
