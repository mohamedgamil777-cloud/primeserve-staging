import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RewardCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" /> {/* Title */}
            <Skeleton className="h-4 w-64" /> {/* Description */}
          </div>
          {/* <Badge variant="secondary">
            <Skeleton className="h-5 w-12" />
          </Badge> */}
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-full mx-auto" />
        {/* <Button disabled className="w-full">
        </Button> */}
      </CardContent>
    </Card>
  );
}
