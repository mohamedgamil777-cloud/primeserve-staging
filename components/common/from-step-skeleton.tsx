import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const FormStepSkeleton = () => {
    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" /> {/* Title */}
                <Skeleton className="h-4 w-2/3" />        {/* Description */}
            </CardHeader>
            <CardContent className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-1/4" /> {/* Label */}
                        <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                    </div>
                ))}
                <Skeleton className="h-10 w-32 rounded-md" /> {/* Submit button */}
            </CardContent>
        </Card>
    )
}

export default FormStepSkeleton
