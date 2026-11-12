import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

export default function ServiceCardSkeleton({}: Props) {
  return (
    <Card className="overflow-hidden py-0">
      <Skeleton className="aspect-video w-full" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}