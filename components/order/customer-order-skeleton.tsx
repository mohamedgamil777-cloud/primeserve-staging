import { Skeleton } from "@/components/ui/skeleton";

export function CustomerOrderSkeleton() {
    return (
        <div className="rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32" /> {/* Order ID */}
                        <Skeleton className="h-5 w-20 rounded-full" /> {/* Badge */}
                    </div>
                    <Skeleton className="h-4 w-24" /> {/* Date */}
                    <Skeleton className="h-4 w-40 mt-2" /> {/* Items + Total */}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                    <Skeleton className="h-8 w-24 rounded-md" /> {/* View Details Button */}
                    <Skeleton className="h-8 w-20 rounded-md" /> {/* Optional Buy Again */}
                </div>
            </div>
        </div>
    );
}
