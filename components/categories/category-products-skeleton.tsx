import React from 'react'
import { Skeleton } from '../ui/skeleton'

type Props = {}

export default function CategoryProductsSkeleton({}: Props) {
  return (
    <>
      {
        Array(6)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))
      }
    </>
  )
}