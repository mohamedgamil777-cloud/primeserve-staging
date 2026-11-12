"use client"
import { deleteAddress } from '@/actions/address'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ExistingAddress } from '@/types/address'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import React, { PropsWithChildren } from 'react'
import { toast } from 'sonner'

type Props = {
  address:Pick<ExistingAddress,"id"|"name">,
}

export default function AddressDeleter({address,children}: PropsWithChildren<Props>) {
  const queryClient = useQueryClient()
  const handleDeleteAddress = async()=>{
    try {
      const res = await deleteAddress(address.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["addresses"]})
        toast.success(`Address "${address.name}" has been deleted successfully.`)
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
            This will permanently delete {address.name} from the system. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAddress} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}