// ProductCardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function WishlistItemSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 rounded-lg border p-4 animate-pulse">
            <Skeleton className="h-24 w-24 rounded-md" />
            <div className="flex flex-1 flex-col text-center sm:text-left space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                <Skeleton className="h-9 w-full sm:w-24" />
                <Skeleton className="h-9 w-full sm:w-24" />
                <Skeleton className="h-9 w-9 rounded" />
            </div>
        </div>
    );
}
