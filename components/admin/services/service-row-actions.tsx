"use client"
import { toggleServiceStatus } from '@/actions/service'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { ServiceItem } from '@/types/services'
import { useQueryClient } from '@tanstack/react-query'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import { toast } from 'sonner'
import ServiceDeleter from './service-deleter'
import { getLocalizedValue } from '@/types/internationalization'
import { useLocale } from '@/hooks/use-locale'

type Props = {
  service:ServiceItem
}

export default function ServiceRowActions({service}: Props) {
  const locale = useLocale()
  const router = useRouter()
  const queryClient = useQueryClient()
  const deletorRef = useRef<HTMLButtonElement>(null)

  const handleToggleStatus = async () => {
    try {
      const res = await toggleServiceStatus(service.id,!service.isActive)
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["services"]})
        toast.success(`Status of Service "${getLocalizedValue(service.nameI18n,locale)}" has been updated successfully.`)        
      }
      
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
  }
  
  
  return (
    <>
      <ServiceDeleter service={service}>
        <Button className='hidden' ref={deletorRef}>
          Delete
        </Button>
      </ServiceDeleter>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem onClick={() => router.push(`/admin/services/${service.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => router.push(`/admin/services/${service.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Service
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            <Switch className="mr-2 h-4 w-4" />
            {service.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => deletorRef.current?.click()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}