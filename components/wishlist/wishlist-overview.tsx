"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { useWishlist } from '@/hooks/use-wishlist'
import { range } from '@/lib/utils'
import { WishlistItemSkeleton } from './wishlist-item-skeleton'
import EmptyWishlist from './empty-wishlist'
import WishlistItemCard from './wishlist-item-card'
import { useLocale } from 'next-intl'

type Props = {}

export default function WishlistOverview({}: Props) {
  const locale = useLocale()
  const { isLoading, data } = useWishlist({})
  const last5Items = data?.slice(0,5) ?? []
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
        <CardDescription>Items you've saved for later</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {
            isLoading
            ?
            range(0,5).map(idx=>(
              <WishlistItemSkeleton key={idx}/>
            ))
            :
            last5Items.length === 0
            ?
            <EmptyWishlist/>
            :
            last5Items.map(item=>(              
              <WishlistItemCard key={item.id} item={item}/>
            ))
          }
        </div>
        <div className="mt-4 text-center">
          <Button variant="link" asChild>
            <Link href={`/${locale}/account/wishlist`}>
              View Full Wishlist
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}