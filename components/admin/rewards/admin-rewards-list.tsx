"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import RewardCreator from "./reward-creator"
import AdminRewardCard from "./admin-reward-card"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useRewards } from "@/hooks/use-rewards"
import InfiniteScrollContainer from "@/components/common/infinite-scroll-container"
import { AdminRewardsEmpty } from "./admin-rewards-empty"
import { AdminRewardCardSkeleton } from "./admin-reward-card-skeleton"

export function AdminRewardsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebouncedValue(searchTerm,1000)

  const query = useRewards({
    "query":debouncedSearchTerm
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rewards</CardTitle>
            <CardDescription>Manage available rewards for your loyalty program</CardDescription>
          </div>
          <RewardCreator/>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="space-y-4">
          <InfiniteScrollContainer
            query={query}
            keyExtractor={(reward)=>reward.id}
            renderItem={reward=><AdminRewardCard reward={reward}/>}
            customEmptyStateComponent={<AdminRewardsEmpty/>}
            customSkeletonComponent={<AdminRewardCardSkeleton/>}
            containerClassName=" md:grid-cols-1 lg:grid-cols-1"
            skeletonClassName=" bg-card h-auto"
          />
        </div>
      </CardContent>
    </Card>
  )
}
