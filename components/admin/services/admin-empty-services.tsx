"use client"
import { EmptyStateProps } from "@/components/categories/admin-empty-states";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

export function AdminEmptyServices({
  title = "No Services Found",
  description = "You haven't added any services yet. Add your first service to get started.",
  action,
}: EmptyStateProps) {
  const locale = useLocale()
  action = action ?? (
    <Button asChild>
      <Link href={`/${locale}/admin/services/new`}>
        <Wrench className="mr-2 h-4 w-4" />
        Add Product
      </Link>
    </Button>
  );
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <Wrench className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-[320px]">{description}</p>
        {action}
      </div>
    </div>
  )
}
