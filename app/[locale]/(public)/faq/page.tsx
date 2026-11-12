import FAQPage from '@/components/faq-page'
import { db } from '@/db'
import { getTenantId } from '@/lib/tenant'
import React from 'react'
import { localizeContent } from '@/lib/content-ar'

export default async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const storeId = await getTenantId()
  const storeFAQS = await db.query.faqCategories.findMany({
    "where":(faqCategories,{eq})=>eq(faqCategories.storeId,storeId),
    "with":{
      "faqs":true,
    }
  })
  return (
    <FAQPage storeFAQS={storeFAQS.map(c => ({
      ...c,
      name: localizeContent(c.name, locale),
      faqs: c.faqs.map(f => ({ ...f, question: localizeContent(f.question, locale), answer: localizeContent(f.answer, locale) })),
    }))}/>
  )
}