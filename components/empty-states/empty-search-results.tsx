"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SearchX } from "lucide-react"
import { useRouter } from "next/navigation"

interface EmptySearchResultsProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void,
  className?:string
}

export function EmptySearchResults({ className, title, description, actionLabel, onAction }: EmptySearchResultsProps) {
  const router = useRouter()
  const clearSearch = () => {
    // setSearchQuery("")
    router.push("/doctors")
  }
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center",className)}>
      <div className="rounded-full bg-muted p-6 mb-6">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && <Button onClick={onAction ?? clearSearch}>{actionLabel}</Button>}
    </div>
  )
}

