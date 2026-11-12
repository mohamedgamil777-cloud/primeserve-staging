import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function FAQLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <Skeleton className="h-10 w-80 mx-auto" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content Skeleton */}
          <div className="lg:col-span-3 space-y-8">
            {[1, 2, 3].map((category) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((faq) => (
                    <Card key={faq}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-5 w-5" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
