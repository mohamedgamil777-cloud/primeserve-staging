"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTiers } from "@/hooks/use-tiers"
import InfiniteScrollContainer from "@/components/common/infinite-scroll-container"
import AdminTierCard from "./admin-tier-card"
import { AdminTiersEmpty } from "./admin-tiers-empty"
import AdminTierCardSkeleton from "./admin-tier-card-skeleton"
import TierCreator from "./tier-creator"


export function AdminTiersList() {
  const query = useTiers({})
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Membership Tiers</CardTitle>
            <CardDescription>Manage membership tiers and their benefits</CardDescription>
          </div>
          <TierCreator/>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InfiniteScrollContainer
            query={query}
            keyExtractor={(tier)=>tier.id}
            renderItem={tier=><AdminTierCard tier={tier}/>}
            customEmptyStateComponent={<AdminTiersEmpty/>}
            customSkeletonComponent={<AdminTierCardSkeleton/>}
            containerClassName=" md:grid-cols-1 lg:grid-cols-1"
            skeletonClassName=" bg-card h-auto"
          />
        </div>
      </CardContent>
    </Card>
  )
}
