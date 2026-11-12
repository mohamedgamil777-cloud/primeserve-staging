import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp } from 'lucide-react'

export default function AdminPointEarningMethodCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
      <div className="flex items-start space-x-4 flex-1">
        <div className="text-2xl">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center space-x-4 text-xs">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-right mr-4 space-y-1">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-10 rounded-full" /> {/* Switch placeholder */}
        <Skeleton className="h-5 w-10 rounded-full" /> {/* options placeholder */}
      </div>
    </div>
  )
}
