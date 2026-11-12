"use client"
import { Package } from "lucide-react";
import { EmptyStateProps } from "../categories/admin-empty-states";
import { Button } from "../ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";

export function AdminProductsEmpty({
  title = "No Products Found",
  description = "You haven't added any products yet. Add your first product to get started.",
  action,
}: EmptyStateProps) {
  const locale = useLocale()
  action = action ?? (
    <Button asChild>
      <Link href={`/${locale}/admin/products/new`}>
        <Package className="mr-2 h-4 w-4" />
        Add Product
      </Link>
    </Button>
  );
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
