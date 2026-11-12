import { Skeleton } from "@/components/ui/skeleton";

export default function CartPageSkeleton() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Loading State */}
        <div className="max-h-[300px] overflow-auto p-4 space-y-3">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex gap-4 p-4 border rounded-lg">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-7 w-8" />
                  <Skeleton className="h-7 w-7 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Items Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-lg border">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
              <Skeleton className="h-[1px] w-full" />
              <div className="space-y-4 p-6">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-7 w-8" />
                        <Skeleton className="h-7 w-7 rounded-full" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards Section */}
            <div className="rounded-lg border">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <div className="grid gap-4">
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="rounded-lg border p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 mt-1" />
                      <Skeleton className="h-9 w-24 mt-3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="row-span-2">
            <div className="rounded-lg border">
              <div className="p-6">
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-[1px] w-full" />
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-[1px] w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 rounded-lg border p-6">
              <Skeleton className="h-5 w-24" />
              <div className="mt-4 flex gap-2">
                {[...Array(4)].map((_, idx) => (
                  <Skeleton key={idx} className="h-10 w-12 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}