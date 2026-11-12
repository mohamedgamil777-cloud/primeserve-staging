import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import { getTenantId } from "@/lib/tenant";
import { db } from "@/db";
import { LocaleProvider } from '@/components/languages/local-provider'
import { getMessages } from "next-intl/server";

const cairo = Cairo({
  subsets: ["latin"],
});

 
export async function generateMetadata(): Promise<Metadata> {
  const storeId = await getTenantId()
  const store = await db.query.stores.findFirst({
    "where":(stores,{eq})=>eq(stores.id,storeId),
    "columns":{
      "name":true,
      "description":true,
    }
  })

  
  return {
    title: store?.name,
    description: store?.description
  }
}
 

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>
}>) {
  const [storeId,{locale}] = await Promise.all([
    getTenantId(),
    params,
  ]) 
  const store = await db.query.stores.findFirst({
    "where":(stores,{eq})=>eq(stores.id,storeId),
    "columns":{
      "gaId":true,
    }
  })
  const messages = await getMessages({ locale });
  return (
    <html dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning lang={locale}>
      <body
        className={`${cairo.className} antialiased`}
        suppressHydrationWarning
      >
        <LocaleProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <NuqsAdapter>
                <Toaster richColors/>
                {children}
              </NuqsAdapter>
            </ReactQueryProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
      {
        store?.gaId
        &&
        <GoogleAnalytics gaId={store.gaId} />
      }
    </html>
  );
}
