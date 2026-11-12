import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
    return (
        <li className="flex flex-col p-6 sm:flex-row animate-pulse">
            <div className="flex flex-1 gap-4">
                <Skeleton className="h-24 w-24 rounded-lg" />
                <div className="flex flex-1 flex-col justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded" />
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-7 w-7 rounded" />
                    </div>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 sm:mt-0 sm:flex-col sm:items-end">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
            </div>
        </li>
    );
}
