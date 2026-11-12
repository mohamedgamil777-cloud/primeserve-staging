"use client"

import { BarChart3, CalendarCheck, ChevronRight, Clipboard, ClipboardList, Clock, CreditCard, FileChartColumnIncreasing, FileEdit, FileText, Gift, Heart, LayoutDashboard, List, MapPin, MessageSquare, Package, Percent, Plus, Settings, ShoppingBag, Tag, User, Users, Wrench, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useLocale } from "next-intl"



interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string; icon?: React.ReactNode; }[]
}
  

export function NavMain() {
  const locale = useLocale();
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `/${locale}/admin`,
      icon: <LayoutDashboard/>,
    },
    {
      title: "Products",
      href: `/${locale}/admin/products`,
      icon: <ShoppingBag/>,
    },
    {
      title: "Categories",
      href: `/${locale}/admin/categories`,
      icon: <Tag/>,
    },

    {
      title: "Services",
      href: `/${locale}/admin/services`,
      icon: <Wrench/>,
      submenu:[
        {
          "title":"Categories",
          "href":`/${locale}/admin/services/categories`,
          "icon":<Tag/>
        },
        {
          "title":"Services List",
          "href":`/${locale}/admin/services`,
          "icon":<List/>
        },
        {
          "title":"New Service",
          "href":`/${locale}/admin/services/new`,
          "icon":<Plus/>
        },
        {
          "title":"Service Requests",
          "href":`/${locale}/admin/services/requests`,
          "icon":<CalendarCheck/>
        },
      ]
    },
    {
      title: "Orders",
      href: `/${locale}/admin/orders`,
      icon: <ClipboardList/>,
    },
    {
      title: "Customers",
      href: `/${locale}/admin/customers`,
      icon: <Users/>,
    },
    {
      title: "Rewards",
      href: `/${locale}/admin/rewards`,
      icon: <Gift/>,
    },
    {
      title: "Messages",
      href: `/${locale}/admin/messages`,
      icon: <MessageSquare/>,
    },
    {
      title: "Promotion Codes",
      href: `/${locale}/admin/promotions`,
      icon: <Percent/>,
    },
    {
      title: "Analytics",
      href: `/${locale}/admin/analytics`,
      icon: <BarChart3/>,
    },
    {
      title: "Reports",
      href: `/${locale}/admin/reports`,
      icon: <FileChartColumnIncreasing/>,
    },
    {
      title: "Settings",
      href: `/${locale}/admin/settings`,
      icon: <Settings/>,
    },
  ]
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          !item.submenu
          ?
          <SidebarMenuItem key={item.title} className=" cursor-pointer">
            <Link href={item.href} className=" cursor-pointer">
              <SidebarMenuButton tooltip={item.title}>
                {item.icon}
                <span>{item.title}</span>
                {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          :
          <Collapsible
            key={item.title}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem className=" cursor-pointer">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.submenu?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.href}>
                          {subItem.icon}
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
