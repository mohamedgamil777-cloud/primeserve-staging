import { updateSession } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const supportedLocales = ['en', 'ar']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  // 1. Check cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale
  }

  // 2. Check Accept-Language header
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const languages = new Negotiator({ headers }).languages()
  
  try {
    return matchLocale(languages, supportedLocales, defaultLocale)
  } catch (e) {
    return defaultLocale
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return
  }

  // Check if pathname is missing locale
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    
    // Redirect to localized path
    const newUrl = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    )
    
    // Set cookie for future requests
    const response = NextResponse.redirect(newUrl)
    response.cookies.set('NEXT_LOCALE', locale)
    return response
  }

  return await updateSession(request)
}

// export async function middleware(request: NextRequest) {
  // const requestHeaders = new Headers(request.headers);
  // if(IS_MULTI_TENANT_SUPPORTED){

  //   const host = request.headers.get("host"); // e.g. store1.myapp.com or coolbrand.com
  //   if (!host) return NextResponse.next();
  
  //   // Normalize and remove port if present (like localhost:3000)
  //   const domain = host.split(":")[0];
  
  //   const tenant = await db.query.stores.findFirst({
  //     where: or(
  //       eq(stores.customDomain, domain),
  //       eq(stores.subdomain, domain.split(".")[0]) // fallback to subdomain
  //     ),
  //   });
  
  //   if (!tenant) {
  //     return new NextResponse("Tenant not found", { status: 404 });
  //   }
  //   requestHeaders.set("x-tenant-id", tenant.id);
  // }else requestHeaders.set("x-tenant-id", DEFAULT_TENANT_ID);



  // return NextResponse.next({
  //   ...(await updateSession(request)),
  //   request: { 
  //     ...request,
  //     headers: requestHeaders 
  //   },
  // });
// }

export const config = {
  runtime: "nodejs", // Specify the runtime environment as Node.js
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};


// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }