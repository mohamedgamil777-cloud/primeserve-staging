"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PointEarningMethodCreator from "./point-earning-method-creator"
import AdminPointEarningMethodCard from "./admin-point-earning-method-card"
import { usePointEarningMethods } from "@/hooks/use-point-earning-methods"
import InfiniteScrollContainer from "@/components/common/infinite-scroll-container"
import { AdminPointEarningMethodsEmpty } from "./admin-point-earning-methods-empty"
import AdminPointEarningMethodCardSkeleton from "./admin-point-earning-method-card-skeleton"

export function AdminEarningMethodsList() {
  const query = usePointEarningMethods({})
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Earning Methods</CardTitle>
            <CardDescription>Manage how customers can earn loyalty points</CardDescription>
          </div>
          <PointEarningMethodCreator/>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InfiniteScrollContainer
            query={query}
            keyExtractor={(method)=>method.id}
            renderItem={method=><AdminPointEarningMethodCard pointEarningMethod={method}/>}
            customEmptyStateComponent={<AdminPointEarningMethodsEmpty/>}
            customSkeletonComponent={<AdminPointEarningMethodCardSkeleton/>}
            containerClassName=" md:grid-cols-1 lg:grid-cols-1"
            skeletonClassName=" bg-card h-auto"
          />
        </div>
      </CardContent>
    </Card>
  )
}
