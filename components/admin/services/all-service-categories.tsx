import { db } from '@/db'
import { serviceCategories, services } from '@/db/schema'
import { getTenantId } from '@/lib/tenant'
import { and, eq, sql } from 'drizzle-orm'
import React from 'react'
import ServiceCategoryCard from './service-category-card'
import { getTranslations } from 'next-intl/server'
import { SERVICE_CATEGORY_PRIORITY, sortByPriority } from '@/lib/home-priority'


export default async function AllServiceCategories({ locale }: {  locale: string }) {
  const [storeId,t] = await Promise.all([
    getTenantId(),
    getTranslations({locale})
  ]) 
  const _serviceCategories = await db
    .select({
      "isActive":serviceCategories.isActive,
      "isFeatured":serviceCategories.isFeatured,
      "slug":serviceCategories.slug,
      id: serviceCategories.id,
      nameI18n: serviceCategories.nameI18n,
      descriptionI18n: serviceCategories.descriptionI18n,
      icon: serviceCategories.icon,
      image: serviceCategories.image,
      createdAt: serviceCategories.createdAt,
      servicesCount: sql<number>`COUNT(${services.id})`.as('servicesCount'),
    })
    .from(serviceCategories)
    .where(
      and(
        eq(serviceCategories.storeId,storeId),
        // eq(serviceCategories.isFeatured,true),
      )
    )
    .leftJoin(services, sql`${services.categoryId} = ${serviceCategories.id}`)
    .groupBy(serviceCategories.id)
    .orderBy(serviceCategories.nameI18n);

  if(_serviceCategories.length === 0) return null
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{t('service-categories')}</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {sortByPriority(_serviceCategories, SERVICE_CATEGORY_PRIORITY).map((category) => (
          <ServiceCategoryCard key={category.id} category={category}/>
        ))}
      </div>
    </section>
  )
}