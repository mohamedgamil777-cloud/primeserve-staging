"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { User, Package, Heart, CreditCard, MapPin, Bell, Settings, LogOut, Gift, Target, BarChart3 } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useState } from "react"
import { toast } from "sonner"
import { signout } from "@/actions/auth"
import { useQueryClient } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

export function AccountSidebar() {
  const locale = useLocale()
  const t = useTranslations()
  const queryClient = useQueryClient()
  const [loggingOut, setLoggingOut] = useState(false)
  const pathname = usePathname()
  const { data } = useCurrentUser()
  const handleLogout = async()=>{
    setLoggingOut(true)
    try {
      const res = await signout()
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["current-user"]})
        await queryClient.invalidateQueries()
        toast.success(t('you-have-logged-out-successfully'))
      } 
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setLoggingOut(false)
  }


  const sidebarItems = [
    {
      title: t('account-overview'),
      href: `/${locale}/account`,
      icon: User,
    },
    {
      title: t('orders'),
      href: `/${locale}/account/orders`,
      icon: Package,
    },
    {
      title: t('wishlist'),
      href: `/${locale}/account/wishlist`,
      icon: Heart,
    },
    {
      title: t('reports-and-analytics'),
      href: `/${locale}/account/reports`,
      icon: BarChart3,
    },
    {
      title: t('budget-management'),
      href: `/${locale}/account/budget`,
      icon: Target,
    },
    {
      title: t('rewards'),
      href: `/${locale}/account/rewards`,
      icon: Gift,
    },
    // {
    //   title: "Payment Methods",
    //   href: "/account/payment",
    //   icon: CreditCard,
    // },
    {
      title: t('addresses'),
      href: `/${locale}/account/addresses`,
      icon: MapPin,
    },
    {
      title: t('notifications'),
      href: `/${locale}/account/notifications`,
      icon: Bell,
    },
    {
      title: t('account-settings'),
      href: `/${locale}/account/settings`,
      icon: Settings,
    },
  ]


  return (
    <div className="w-full md:w-64 space-y-6">
      <div className="flex flex-col md:sticky md:top-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-medium">{data?.firstName} {data?.lastName}</h2>
            <p className="text-sm text-muted-foreground">{data?.role}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
          <div
            onClick={loggingOut ? undefined : handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('sign-out')}</span>
          </div>
        </nav>
      </div>
    </div>
  )
}
