"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import RecentOrders from '../order/recent-orders'
import WishlistOverview from '../wishlist/wishlist-overview'
import AddressesOverview from '../address/addresses-overview'
import { parseAsString, useQueryState } from 'nuqs'

type Props = {}

export default function CustomerOverviewTabs({}: Props) {
  const [tab,setTab] = useQueryState("tab",parseAsString.withDefault("recent-orders"))
  return (
    <Tabs defaultValue={tab} value={tab} onValueChange={setTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
      </TabsList>
      <TabsContent value="recent-orders" className="space-y-4">
        <RecentOrders/>
      </TabsContent>
      <TabsContent value="wishlist" className="space-y-4">
        <WishlistOverview/>
      </TabsContent>
      <TabsContent value="addresses" className="space-y-4">
        <AddressesOverview/>
      </TabsContent>
    </Tabs>
  )
}