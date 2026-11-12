"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/hooks/use-locale'
import { useWishlist } from '@/hooks/use-wishlist'
import { genProductImageUrl } from '@/lib/product'
import { getLocalizedValue } from '@/types/internationalization'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
  customerId:string
}

export default function CustomerWishlist({customerId}: Props) {
  const locale = useLocale()
  const { data, isLoading } = useWishlist({
    customerId
  })
  
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
        <CardDescription>Products this customer has saved to their wishlist</CardDescription>
      </CardHeader>
      <CardContent>
        {!isLoading && data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-base font-medium">No items in wishlist</h3>
            <p className="text-sm text-muted-foreground">
              This customer hasn't added any products to their wishlist yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                  <img
                    src={genProductImageUrl(item.mainImage)}
                    alt={getLocalizedValue(item.nameI18n,locale)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <h4 className="font-medium">{getLocalizedValue(item.nameI18n,locale)}</h4>
                  <p className="text-sm text-muted-foreground">EGP {item.price.toFixed(2)}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/${locale}/admin/products/${item.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Product
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}