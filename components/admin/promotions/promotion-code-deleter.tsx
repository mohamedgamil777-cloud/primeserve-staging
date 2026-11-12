import { deletePromotionCode } from '@/actions/promotionCode'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { PromotionCode } from '@/types/promotionCode'
import { useQueryClient } from '@tanstack/react-query'
import React, { PropsWithChildren, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  promotionCode:PromotionCode
}

export default function PromotionCodeDeleter({promotionCode,children}: PropsWithChildren<Props>) {
  const queryClient = useQueryClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleDelete = async()=>{
    setIsLoading(true)
    try {
      const res = await deletePromotionCode(promotionCode.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["promotions"]})
        toast.success(`Promotion ${promotionCode.code} has been deleted successfully`)
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsLoading(false)
  }
  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogTrigger>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this promotion code. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}