"use client"
import { deleteServiceCategory } from '@/actions/serviceCategory'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/hooks/use-locale'
import { genServiceCategoriesQueryKeys } from '@/hooks/use-service-categories'
import { getLocalizedValue } from '@/types/internationalization'
import { ExistingServiceCategory } from '@/types/serviceCategory'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import React, { PropsWithChildren } from 'react'
import { toast } from 'sonner'

type Props = {
  category:Pick<ExistingServiceCategory,"id"|"nameI18n">,
}

export default function ServiceCategoryDeleter({category,children}: PropsWithChildren<Props>) {
  const locale = useLocale()
  const queryClient = useQueryClient()
  const handleDeleteCategory = async()=>{
    try {
      const res = await deleteServiceCategory(category.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":genServiceCategoriesQueryKeys()})
        toast.success(`Category "${getLocalizedValue(category.nameI18n,locale)}" has been deleted successfully.`)
      } 
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {
          children
          ??
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        }
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {getLocalizedValue(category.nameI18n,locale)} from the system. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}