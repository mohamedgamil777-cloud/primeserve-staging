import type React from "react"
import type { Metadata } from "next"
import { getSession } from "@/lib/auth-server"
import RedirectToDashboard from "@/components/common/redirect-to-dashboard"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in to your account or create a new one",
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if(session) return <RedirectToDashboard role={session.user_role}/>
  return <div className="min-h-screen bg-gray-50 dark:bg-background">{children}</div>
}
