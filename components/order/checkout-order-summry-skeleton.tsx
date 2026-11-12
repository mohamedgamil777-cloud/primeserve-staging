import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'

type Props = {}

export default function CheckoutOrderSummrySkeleton({}: Props) {
  return (
    <div>
      <div className="rounded-lg border">
        <div className="p-6">
          <Skeleton className="h-6 w-32" />
        </div>
        <Separator />
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}