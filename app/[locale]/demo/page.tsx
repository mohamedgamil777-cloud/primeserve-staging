// Standalone, unlinked clickable demo of the PrimeServe employee app.
// Not in the site menu and hidden from search engines until Mohamed approves it.
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { EmployeeAppDemo } from "@/components/employee-app-demo/demo-page"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "appDemo" })
  return { title: `${t("metaTitle")} | PrimeServe`, robots: { index: false, follow: false } }
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <EmployeeAppDemo locale={locale} />
}
