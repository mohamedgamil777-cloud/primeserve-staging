"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { cancelAccountDeletion } from '@/actions/user'
import { useRouter } from 'next/navigation'

type Props = {}

export default function AccountDeletionCancelButton({}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCancelDeletion = async () => {
    setIsLoading(true)
    try {
      const res = await cancelAccountDeletion()
      if(res.error) toast.error(res.error)
      if(res.success){
        toast.success("Account deletion has been cancelled successfully.")
        router.refresh()
      } 
    } catch (error) {
      toast.error("Failed to cancel account deletion. Please contact support.")
    }
    setIsLoading(false)
  }
  
  return (
    <Button onClick={handleCancelDeletion} disabled={isLoading} size="lg" className="w-full md:w-auto">
      {isLoading ? "Cancelling..." : "Cancel Account Deletion"}
    </Button>
  )
}