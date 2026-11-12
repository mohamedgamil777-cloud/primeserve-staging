"use cient"
import React, { use } from 'react'
import { ProductCard } from '../product-card'
import { Button } from '../ui/button'

type Props = {
    productsPromise:Promise<any[]>
}

export default function CategoryProducts({productsPromise}: Props) {
  const products = use(productsPromise)
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length > 0
          ? products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)
          : null}
      </div>

      {products.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      )}
    
    </>
  )
}