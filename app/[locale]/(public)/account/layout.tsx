import type React from "react"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { getSession } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import RedirectToDashboard from "@/components/common/redirect-to-dashboard"
import { Suspense } from "react"
import AccountDeletionPageSkeleton from "@/components/account/account-deletion-page-skeleton"
import AccountDeletionPage from "@/components/account/account-deletion-page"
import { getTenantId } from "@/lib/tenant"
import { db } from "@/db"
import VerifyEmailPage from "@/components/auth/verify-email-page"

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [session,storeId] = await Promise.all([getSession(),getTenantId()])
  if(!session) redirect("/auth/login")
  if(session.user_role !== "customer") return <RedirectToDashboard role={session.user_role}/>
  
  const [user,emailPrefs] = await Promise.all([
    db.query.users.findFirst({
      "where":(users,{and,eq})=>and(
        eq(users.storeId,storeId),
        eq(users.id,session.user_id),
      ),
      "columns":{
        "verified":true,
        "verificationTokenExpires":true
      }
    }),
    db.query.storeEmailPreferences.findFirst({
      "where":(toreEmailPreferences,{eq})=>eq(toreEmailPreferences.storeId,storeId),
      "columns":{"resendApiKey":true}
    }),
  ])
  
  if(
    !!emailPrefs?.resendApiKey 
    && 
    !user?.verified
  ) return <VerifyEmailPage resendEmailOnMount={!user?.verificationTokenExpires || new Date() > user?.verificationTokenExpires!}/>

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
      <Suspense fallback={<AccountDeletionPageSkeleton/>}>
        <AccountDeletionPage locale={locale}>
          <div className="flex flex-col gap-8 md:flex-row">
            <AccountSidebar />
            <div className="flex-1">{children}</div>
          </div>
        </AccountDeletionPage>
      </Suspense>
    </div>
  )
}
