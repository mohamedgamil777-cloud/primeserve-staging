"use client"
import { ProductSort } from '@/types/product'
import { SlidersHorizontal } from 'lucide-react'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useTranslations } from 'next-intl'

type Props = {
  sortBy:ProductSort,
  setSortBy:(sort:ProductSort)=>void
}

export default function ProductSortSelector({setSortBy,sortBy}: Props) {
  const t = useTranslations()
  return (
     <div className="flex items-center gap-2 ml-auto">
      <SlidersHorizontal className="h-4 w-4" />
      <span className="text-sm">{t('sort-by-0')}</span>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('sort-by')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">{t('featured')}</SelectItem>
          <SelectItem value="price-low-high">{t('price-low-to-high')}</SelectItem>
          <SelectItem value="price-high-low">{t('price-high-to-low')}</SelectItem>
          <SelectItem value="newest">{t('newest')}</SelectItem>
          <SelectItem value="rating">{t('rating')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}