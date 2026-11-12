"use client"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Layers, Package, ShoppingBag, Users } from "lucide-react"
import { useLocale } from "next-intl"

export interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function AdminProductsEmpty({
  title = "No Products Found",
  description = "You haven't added any products yet. Add your first product to get started.",
  action
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

export function AdminCategoriesEmpty({
  title = "No Categories Found",
  description = "You haven't added any categories yet. Categories help organize your products.",
  action
}: EmptyStateProps) {
  const locale = useLocale()
  action = action ?? (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href={`/${locale}/admin/subcategories/new`}>
          <Layers className="mr-2 h-4 w-4" />
          Add Subcategory
        </Link>
      </Button>
      <Button asChild>
        <Link href={`/${locale}/admin/categories/new`}>
          <Package className="mr-2 h-4 w-4" />
          Add Category
        </Link>
      </Button>
    </div>
  );
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

export function AdminOrdersEmpty({
  title = "No Orders Found",
  description = "There are no orders yet. Orders will appear here when customers make purchases.",
}: EmptyStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-[320px]">{description}</p>
      </div>
    </div>
  )
}

export function AdminCustomersEmpty({
  title = "No Customers Found",
  description = "You don't have any customers yet. They will appear here when they create an account.",
}: EmptyStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <Users className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-[320px]">{description}</p>
      </div>
    </div>
  )
}
