import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'

type Props = {}

export default function PaymentMethodSectionSkeleton({}: Props) {
  return (
    <div className="rounded-lg border">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <Separator />
      <div className="p-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-4 w-4 rounded-full mt-1" />
            <div className="flex-1">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}