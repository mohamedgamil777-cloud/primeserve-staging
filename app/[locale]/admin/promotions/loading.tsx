import { Skeleton } from "@/components/ui/skeleton"

export default function PromotionsLoading() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-[500px] rounded-lg" />
    </div>
  )
}
