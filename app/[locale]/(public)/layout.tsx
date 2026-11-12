import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Header } from "@/components/layout/public/header"
import { Footer } from "@/components/layout/public/footer"


export const metadata: Metadata = {
  title: "PrimeServe - Modern E-commerce",
  description: "A modern e-commerce website for companies",
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
