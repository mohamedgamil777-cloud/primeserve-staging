"use client"
import { deleteTier } from '@/actions/tier'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ExistingTier } from '@/types/tier'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import React, { PropsWithChildren } from 'react'
import { toast } from 'sonner'

type Props = {
  tier:Pick<ExistingTier,"id"|"name">,
}

export default function TierDeleter({tier,children}: PropsWithChildren<Props>) {
  const queryClient = useQueryClient()
  const handleDeleteTier = async()=>{
    try {
      const res = await deleteTier(tier.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["tiers"]})
        toast.success(`Tier "${tier.name}" has been deleted successfully.`)
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
            This will permanently delete {tier.name} from the system. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTier} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}