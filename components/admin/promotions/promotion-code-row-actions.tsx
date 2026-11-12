import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PromotionCode } from '@/types/promotionCode'
import { Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { CreatePromotionDialog } from './create-promotion-dialog'
import PromotionCodeDeleter from './promotion-code-deleter'
import { togglePromotionCodeActivation } from '@/actions/promotionCode'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  promotion:PromotionCode
}

export default function PromotionCodeRowActions({promotion}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const editorRef = useRef<HTMLButtonElement>(null)
  const deletorRef = useRef<HTMLButtonElement>(null)

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Copied ${code} to clipboard`)
  }

  const toggleStatus = async() => {
    setIsLoading(true)
    try {
      const res = await togglePromotionCodeActivation(promotion.id,!promotion.isActive)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["promotions"]})
        toast.success(`Promotion ${!!promotion.isActive ? "disabled" : "enabled"} successfully`)
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsLoading(false)
  }

  return (
    <DropdownMenu>
      <CreatePromotionDialog initialData={promotion}>
        <button className='hidden' ref={editorRef}>Edit</button>
      </CreatePromotionDialog>
      <PromotionCodeDeleter promotionCode={promotion}>
        <button className='hidden' ref={deletorRef}>Delete</button>
      </PromotionCodeDeleter>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem disabled={isLoading} onClick={() => copyToClipboard(promotion.code)}>
          <Copy className="mr-2 h-4 w-4" />
          Copy code
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLoading} onClick={() => editorRef.current?.click()}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isLoading}
          onClick={toggleStatus}
          className={promotion.isActive ? "text-rose-500" : "text-emerald-500"}
        >
          {promotion.isActive ? "Disable" : "Enable"}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLoading} onClick={() => deletorRef.current?.click()} className="text-rose-500">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}