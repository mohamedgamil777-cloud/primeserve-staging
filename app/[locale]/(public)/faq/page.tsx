import FAQPage from '@/components/faq-page'
import { db } from '@/db'
import { getTenantId } from '@/lib/tenant'
import React from 'react'

type Props = {}

export default async function page({}: Props) {
  const storeId = await getTenantId()
  const storeFAQS = await db.query.faqCategories.findMany({
    "where":(faqCategories,{eq})=>eq(faqCategories.storeId,storeId),
    "with":{
      "faqs":true,
    }
  })
  return (
    <FAQPage storeFAQS={storeFAQS}/>
  )
}