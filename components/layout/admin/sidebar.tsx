"use client"

import * as React from "react"
import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/common/dashboard/layout/nav-user"
import { NavSecondary } from "@/components/common/dashboard/layout/nav-secondary"
import { StoreSwitcher } from "./store-switcher"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/imgs/logo.png"
import { useLocale } from "next-intl"


export function AdminDashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  return (
    <Sidebar side={locale === "ar" ? "right" : "left"} collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={`/${locale}/`} className="flex items-center space-x-2">
          <Image height={40} src={logo} alt="PrimeServe"/>
        </Link>
        {/* <StoreSwitcher/> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary className=" mt-auto"/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
