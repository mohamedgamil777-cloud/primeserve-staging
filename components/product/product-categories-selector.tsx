import { useCategories } from '@/hooks/use-categories'
import { useLocale } from '@/hooks/use-locale'
import { getLocalizedValue } from '@/types/internationalization'
import { useTranslations } from 'next-intl'
import React, { Dispatch, SetStateAction } from 'react'

type Props = {
  selectedCategories:string[],
  setSelectedCategories:Dispatch<SetStateAction<string[]>>
}

export default function ProductCategoriesSelector({selectedCategories,setSelectedCategories}: Props) {
  const { data:categories } = useCategories()
  const t = useTranslations()
  const locale = useLocale()
  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('categories')}</h3>
      <div className="space-y-2">
        {categories?.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`mobile-category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor={`mobile-category-${category.id}`}>{getLocalizedValue(category.nameI18n,locale)}</label>
          </div>
        ))}
      </div>
    </div>
  )
}