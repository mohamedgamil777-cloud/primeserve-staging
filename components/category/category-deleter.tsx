"use client"
import { deleteCategory } from '@/actions/category'
import { deleteSubCategory } from '@/actions/subcategory'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { genCategoriesQueryKeys } from '@/hooks/use-categories'
import { useLocale } from '@/hooks/use-locale'
import { ExistingCategory } from '@/types/category'
import { getLocalizedValue } from '@/types/internationalization'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import React, { PropsWithChildren } from 'react'
import { toast } from 'sonner'

type Props = {
  category:Pick<ExistingCategory,"id"|"nameI18n">,
  isSub?:boolean
}

export default function CategoryDeleter({category,children,isSub}: PropsWithChildren<Props>) {
  const queryClient = useQueryClient()
  const locale = useLocale()
  const handleDeleteCategory = async()=>{
    try {
      const res = isSub ? await deleteSubCategory(category.id) : await deleteCategory(category.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":genCategoriesQueryKeys()})
        toast.success(`${isSub ? "Sub Category" : "Category"} "${getLocalizedValue(category.nameI18n,locale)}" has been deleted successfully.`)
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