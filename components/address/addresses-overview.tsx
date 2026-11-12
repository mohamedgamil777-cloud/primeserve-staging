import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { useAddresses } from '@/hooks/use-addresses'
import { range } from '@/lib/utils'
import AddressCardSkeleton from './address-card-skeleton'
import EmptyAddresses from './empty-addresses'
import AddressCard from './address-card'
import { useLocale } from 'next-intl'

type Props = {}

export default function AddressesOverview({}: Props) {
  const locale = useLocale()
  const { isLoading, data } = useAddresses()
  const newest2Addresses = data?.slice(0,2) ?? []
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Addresses</CardTitle>
        <CardDescription>Manage your shipping and billing addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {
            isLoading
            ?
            range(0,2).map(idx=>(
              <AddressCardSkeleton key={idx}/>
            ))
            :
            newest2Addresses.length === 0
            ?
            <EmptyAddresses/>
            :
            newest2Addresses.map(item=>(   
              <AddressCard address={item} key={item.id}/>           
            ))
          }
        </div>
        <div className="mt-4 text-center">
          <Button variant="link" asChild>
            <Link href={`/${locale}/account/addresses`}>
              Manage Addresses
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}