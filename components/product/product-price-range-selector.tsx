"use client"
import React from 'react'
import { ProductPriceRange, productPriceRanges } from '@/lib/product'
import { useTranslations } from 'next-intl'

type Props = {
  priceRange:ProductPriceRange,
  setPriceRange:(range:ProductPriceRange)=>void
}

export default function ProductPriceRangeSelector({priceRange,setPriceRange}: Props) {
  const t = useTranslations()
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('price-range')}</h3>
      <div className="space-y-2">
        {
          Object.entries(productPriceRanges).map(item=>(
            <div key={item[0]} className="flex items-center gap-2">
              <input
                type="radio"
                id={`price-${item[0]}`}
                name="price-range"
                checked={priceRange === item[0]}
                onChange={() => setPriceRange(item[0] as ProductPriceRange)}
                className="h-4 w-4 border-gray-300"
              />
              <label htmlFor={`price-${item[0]}`}>{t(item[0] === "all" ? "all-prices" : item[0])}</label>
            </div>
          ))
        }
      </div>
    </div>

    // <div className="space-y-4">
    //   <h3 className="text-lg font-medium">Price Range</h3>
    //   <Select value={priceRange} onValueChange={setPriceRange}>
    //     <SelectTrigger>
    //       <SelectValue placeholder="Select price range" />
    //     </SelectTrigger>
    //     <SelectContent>
    //       {
    //         Object.entries(productPriceRanges).map(item=>(
    //           <SelectItem key={item[0]} value={item[0]}>{item[1]}</SelectItem>
    //         ))
    //       }
    //     </SelectContent>
    //   </Select>
    // </div>
  )
}