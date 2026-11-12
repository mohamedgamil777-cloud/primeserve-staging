import RedirectToDashboard from "@/components/common/redirect-to-dashboard"
import CustomerSettings from "@/components/settings/customer-settings"
import { db } from "@/db"
import { getSession } from "@/lib/auth-server"
import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"

export default async function AccountSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [session,t] = await Promise.all([
    getSession(),
    getTranslations({"locale":(await params).locale}),
  ])
  if(!session?.user_id) redirect("/auth/login")
  if(session.user_role !== "customer") return <RedirectToDashboard role={session.user_role}/>

  const userPersonalInfo = await db.query.users.findFirst({
    "columns":{
      "firstName":true,
      "lastName":true,
      "email":true,
      "phone":true
    },
    "where":(users,{eq})=>eq(users.id,session.user_id),
    "with":{
      "preferences":true
    }
  })
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('account-settings')}</h1>
        <p className="text-muted-foreground">{t('manage-your-account-preferences-and-security-settings')}</p>
      </div>
      <CustomerSettings 
        userPersonalInfo={userPersonalInfo!}
        userPreferences={userPersonalInfo?.preferences!}
      />
    </div>
  )
}
