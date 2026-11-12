"use client"
import { updateCustomerNotes } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Edit } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  customerId:string,
  customerNotes?:string|null
}

export default function CustomerNotes({customerNotes,customerId}: Props) {
  const [notes, setNotes] = useState(customerNotes ?? "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  useEffect(()=>{
    if(customerNotes) setNotes(customerNotes)
  },[customerNotes])

  const handleSaveNotes = async () => {
    setIsUpdating(true)
    setIsEditing(true)
    try {
      const res = await updateCustomerNotes(notes,customerId)
      if(res.error) toast.error(res.error)
      else{
        toast.success("Customer notes have been updated.")
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsUpdating(false)
    setIsEditing(false)
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Notes</CardTitle>
        <CardDescription>Private notes about this customer</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Add notes about this customer..."
              className="min-h-[100px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button disabled={isUpdating} variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotes} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">{notes || "No notes added yet."}</p>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Notes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>

  )
}