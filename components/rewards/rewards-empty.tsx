"use client"
import { EmptyStateProps } from "@/components/categories/admin-empty-states";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

export function RewardsEmpty({
  title,
  description,
  action = (
    null
  ),
}: EmptyStateProps) {
  const t = useTranslations()
  title = title ?? t('no-rewards-found')
  description = description ?? t('we-dont-have-any-rewards-that-can-be-redeemed-right-now-stay-tuned-they-are-coming-soon')
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
