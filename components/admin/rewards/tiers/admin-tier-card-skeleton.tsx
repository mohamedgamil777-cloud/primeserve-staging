import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Edit, MoreHorizontal, Trash2, Users } from 'lucide-react'
import React from 'react'

export default function AdminTierCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full bg-muted" />
          <div className="space-y-1">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-40 bg-muted rounded" />
          </div>
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch disabled />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" disabled>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="space-y-1" key={i}>
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 w-20 bg-muted rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
