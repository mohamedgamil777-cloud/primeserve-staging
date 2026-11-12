import { EmptyStateProps } from "@/components/categories/admin-empty-states";
import { Package } from "lucide-react";
import TierCreator from "./tier-creator";

export function AdminTiersEmpty({
  title = "No Tiers Found",
  description = "You haven't added any tiers yet. Add your first tier to get started.",
  action = (
    <TierCreator/>
  ),
}: EmptyStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <Package className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-[320px]">{description}</p>
        {action}
      </div>
    </div>
  )
}
