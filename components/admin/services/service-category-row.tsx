import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/date'
import { DetailedServiceCategory } from '@/types/serviceCategory'
import { Edit, Monitor, MoreHorizontal, Settings, Trash2 } from 'lucide-react'
import React, { useRef } from 'react'
import { toast } from 'sonner'
import ServiceCategoryCreator from './service-category-creator'
import ServiceCategoryDeleter from './service-category-deleter'
import { toggleServiceCategoryStatus } from '@/actions/serviceCategory'
import { useQueryClient } from '@tanstack/react-query'
import { genServiceCategoriesQueryKeys } from '@/hooks/use-service-categories'
import { getIconComponent } from '@/db/lib/icons'
import { useLocale } from '@/hooks/use-locale'
import { getLocalizedValue } from '@/types/internationalization'

type Props = {
  category:DetailedServiceCategory
}


export default function ServiceCategoryRow({category}: Props) {
  const locale = useLocale()
  const IconComponent = getIconComponent(category.icon ?? "Monitor")
  const queryClient = useQueryClient()

  const handleToggleStatus = async () => {
    try {
      const res = await toggleServiceCategoryStatus(category.id,!category.isActive)
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":genServiceCategoriesQueryKeys()})
        toast.success(`Status of Category "${getLocalizedValue(category.nameI18n,locale)}" has been updated successfully.`)        
      }
      
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
  }
  const editorRef = useRef<HTMLButtonElement>(null)
  const deletorRef = useRef<HTMLButtonElement>(null)
  return (
    <TableRow key={category.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium">{getLocalizedValue(category.nameI18n,locale)}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="max-w-md">
        <p className="text-sm text-muted-foreground truncate">{getLocalizedValue(category.descriptionI18n,locale)}</p>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{category.servicesCount} services</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(category.createdAt!)}</TableCell>
      <TableCell>
        <ServiceCategoryCreator serviceCategory={category}>
          <Button ref={editorRef} className="hidden">
            Edit
          </Button>
        </ServiceCategoryCreator>
        <ServiceCategoryDeleter category={category}>
          <Button ref={deletorRef} className="hidden">
            Delete
          </Button>
        </ServiceCategoryDeleter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={()=>editorRef.current?.click()}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleStatus}>
              <Settings className="mr-2 h-4 w-4" />
              {category.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => deletorRef.current?.click()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}