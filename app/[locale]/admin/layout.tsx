import type React from "react"
import type { Metadata } from "next"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/theme/mode-toggle"
import { AdminDashboardSidebar } from "@/components/layout/admin/sidebar"
import { getSession } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import RedirectToDashboard from "@/components/common/redirect-to-dashboard"
import LanguageSwitcher from "@/components/languages/language-switcher"

export const metadata: Metadata = {
  title: "Admin Dashboard - PrimeServe",
  description: "Admin dashboard for PrimeServe e-commerce platform",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if(!session) redirect("/auth/login")
  if(session.user_role !== "seller") return <RedirectToDashboard role={session.user_role}/>
  return (
    <SidebarProvider>
      <AdminDashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ModeToggle/>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <LanguageSwitcher/>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
