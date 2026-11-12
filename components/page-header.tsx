import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface PageHeaderProps {
  heading: string
  description?: string
  className?: string
  actions?:ReactNode
}

export function PageHeader({ heading, description, className, actions }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-row items-center justify-between", className)}>
      <div className=" flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

