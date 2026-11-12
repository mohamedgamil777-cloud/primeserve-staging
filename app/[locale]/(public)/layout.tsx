import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/layout/public/header"
import { Footer } from "@/components/layout/public/footer"


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "ui" })
  return { title: t("siteTitle"), description: t("siteDescription") }
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ locale: string }> 
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer locale={(await params).locale} />
    </div>
  )
}
