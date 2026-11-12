import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PointEarningMethodCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" /> {/* Method name */}
            <Skeleton className="h-3 w-32" /> {/* Description */}
            <div className="flex items-center gap-2 mt-3">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Zap icon placeholder */}
              <Skeleton className="h-4 w-32" /> {/* Points info */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
