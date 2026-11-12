"use client"
import { deletePointEarningMethod } from '@/actions/pointEarningMethod'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ExistingPointEarningMethod } from '@/types/pointEarningMethod'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import React, { PropsWithChildren } from 'react'
import { toast } from 'sonner'

type Props = {
  pointEarningMethod:Pick<ExistingPointEarningMethod,"id"|"name">,
}

export default function PointEarningMethodDeleter({pointEarningMethod,children}: PropsWithChildren<Props>) {
  const queryClient = useQueryClient()
  const handleDeletePointEarningMethod = async()=>{
    try {
      const res = await deletePointEarningMethod(pointEarningMethod.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["point-earning-methods"]})
        toast.success(`Point Earning Method "${pointEarningMethod.name}" has been deleted successfully.`)
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
            This will permanently delete {pointEarningMethod.name} from the system. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeletePointEarningMethod} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}