"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CustomerProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Customer Info */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-6 w-[160px]" />
            <Skeleton className="h-5 w-[60px]" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center space-y-3 pb-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-6 w-[180px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            </div>

            <Skeleton className="my-4 h-[1px] w-full" />

            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              ))}
            </div>

            <Skeleton className="my-4 h-[1px] w-full" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-[120px]" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            <Skeleton className="my-4 h-[1px] w-full" />

            <div className="space-y-2">
              <Skeleton className="h-5 w-[120px]" />
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-[60px] w-full rounded-md" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Notes Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-[100px] w-full" />
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-[80px]" />
                  <Skeleton className="h-9 w-[80px]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders" disabled>
                <Skeleton className="h-4 w-[80px]" />
              </TabsTrigger>
              <TabsTrigger value="wishlist" disabled>
                <Skeleton className="h-4 w-[70px]" />
              </TabsTrigger>
              <TabsTrigger value="activity" disabled>
                <Skeleton className="h-4 w-[80px]" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Orders Tab Content */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-hidden">
                  <div className="border-b">
                    <div className="grid grid-cols-6 gap-4 p-2">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>
                  <div className="divide-y">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="grid grid-cols-6 gap-4 p-2">
                        {[...Array(6)].map((_, j) => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}