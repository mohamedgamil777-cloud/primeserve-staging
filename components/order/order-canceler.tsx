"use client"
import { cancelOrder } from '@/actions/order'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ExistingOrder } from '@/types/order'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import React, { PropsWithChildren } from 'react'
import { toast } from 'sonner'

type Props = {
  order:Pick<ExistingOrder,"id">,
}

export default function OrderCanceler({order,children}: PropsWithChildren<Props>) {
  const queryClient = useQueryClient()
  const handleCancelOrder = async()=>{
    try {
      const res = await cancelOrder(order.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["orders"]})
        toast.success(`Order has been canceld successfully.`)
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
            <span className="sr-only">Cancel</span>
          </Button>
        }
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently cancel the order with no way to resume it. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700">
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}