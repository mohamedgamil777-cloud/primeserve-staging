import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function RedeemedRewardCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-5 w-[70px]" />
            </div>
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-3/4 mb-3" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Skeleton className="h-4 w-[80px] mb-1" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[60px] mb-1" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[70px] mb-1" />
                <Skeleton className="h-4 w-[140px]" />
              </div>
            </div>
          </div>

          <div className="text-right">
            <Skeleton className="h-4 w-[40px] mb-1 ml-auto" />
            <Skeleton className="h-5 w-[60px] ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}