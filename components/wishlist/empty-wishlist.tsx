"use client"
import { Search } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useLocale } from 'next-intl'

type Props = {}

export default function EmptyWishlist({}: Props) {
  const locale = useLocale()
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Your wishlist is empty</h3>
      <p className="text-muted-foreground mt-2 mb-6">Browse our products and add items to your wishlist</p>
      <Button asChild>
        <Link href={`/${locale}/products`}>Browse Products</Link>
      </Button>
    </div>
  )
}