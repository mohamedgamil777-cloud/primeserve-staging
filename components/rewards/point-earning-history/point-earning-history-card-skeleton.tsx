import { Skeleton } from "@/components/ui/skeleton"

export default function PointEarningHistoryCardSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" /> {/* Method/Reward name */}
          <Skeleton className="h-3 w-20" /> {/* Date */}
        </div>
      </div>
      <Skeleton className="h-4 w-16" /> {/* Points */}
    </div>
  )
}
