"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Users, ClipboardList, Settings, BarChart3, Tag, LogOut, Gift, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLocale } from "next-intl"


export function AdminSidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const sidebarItems = [
    {
      title: "Dashboard",
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: `/${locale}/admin/products`,
      icon: ShoppingBag,
    },
    {
      title: "Categories",
      href: `/${locale}/admin/categories`,
      icon: Tag,
    },
    {
      title: "Services",
      href: `/${locale}/admin/services`,
      icon: Wrench,
    },
    {
      title: "Orders",
      href: `/${locale}/admin/orders`,
      icon: ClipboardList,
    },
    {
      title: "Customers",
      href: `/${locale}/admin/customers`,
      icon: Users,
    },
      {
      title: "Rewards",
      href: `/${locale}/admin/rewards`,
      icon: Gift,
    },
    {
      title: "Analytics",
      href: `/${locale}/admin/analytics`,
      icon: BarChart3,
    },
    {
      title: "Settings",
      href: `/${locale}/admin/settings`,
      icon: Settings,
    },
  ]
  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="grid gap-1 px-2 py-4">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted",
                pathname === item.href ? "bg-muted" : "transparent",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href={`/${locale}/`}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
