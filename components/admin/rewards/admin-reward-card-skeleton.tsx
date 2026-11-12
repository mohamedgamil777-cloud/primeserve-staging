import { Skeleton } from '@/components/ui/skeleton'

export function AdminRewardCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg animate-pulse bg-card">
      <div className="space-y-2 w-full max-w-md bg-card">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center space-x-2 bg-card">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-2" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex items-center space-x-2 bg-card">
        <Skeleton className="h-6 w-10 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  )
}
