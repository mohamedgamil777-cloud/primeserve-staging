"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actions?: {
    primary?: {
      label: string
      href?: string
      onClick?: () => void
    }
    secondary?: {
      label: string
      href?: string
      onClick?: () => void
    }
  }
  className?: string
  iconClassName?: string
}

export function EmptyState({ icon: Icon, title, description, actions, className, iconClassName }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className={cn("h-10 w-10 text-muted-foreground", iconClassName)} />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md">{description}</p>
      {actions && (
        <div className="flex flex-wrap gap-3 justify-center">
          {actions.primary &&
            (actions.primary.href ? (
              <Button asChild>
                <Link href={actions.primary.href}>{actions.primary.label}</Link>
              </Button>
            ) : (
              <Button onClick={actions.primary.onClick}>{actions.primary.label}</Button>
            ))}
          {actions.secondary &&
            (actions.secondary.href ? (
              <Button variant="outline" asChild>
                <Link href={actions.secondary.href}>{actions.secondary.label}</Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={actions.secondary.onClick}>
                {actions.secondary.label}
              </Button>
            ))}
        </div>
      )}
    </div>
  )
}
