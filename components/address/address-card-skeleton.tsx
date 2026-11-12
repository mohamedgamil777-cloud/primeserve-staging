import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function AddressCardSkeleton() {
    return (
        <div className="rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
            </div>
            <div className="mt-4 flex gap-2">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>
        </div>
    );
}
