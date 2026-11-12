import { EmptyStateProps } from "@/components/categories/admin-empty-states";
import { Button } from "@/components/ui/button";
import { Layers, Package } from "lucide-react";
import ServiceCategoryCreator from "./service-category-creator";

export function EmptyServiceCategories({
  title = "No Categories Found",
  description = "You haven't added any categories yet. Categories help organize your services.",
  action = (
    <div className="flex gap-2">
      <ServiceCategoryCreator>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </ServiceCategoryCreator>
    </div>
  ),
}: EmptyStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <Layers className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-[320px]">{description}</p>
        {action}
      </div>
    </div>
  )
}