import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CheckCircle, Eye, Mail, MoreHorizontal, Phone, UserCheck } from 'lucide-react'
import React, { useRef } from 'react'
import ServiceRequestDetailsDialog from './service-request-details-dialog'
import { DetailedServiceRequest } from '@/types/serviceRequest'
import Link from 'next/link'

type Props = {
  serviceRequest:DetailedServiceRequest
}

export default function ServiceRequestRowActions({serviceRequest}: Props) {
  const viewDetailsRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <ServiceRequestDetailsDialog serviceRequest={serviceRequest}>
        <button className='hidden' ref={viewDetailsRef}>View Details</button>
      </ServiceRequestDetailsDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={()=>viewDetailsRef.current?.click()}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <UserCheck className="mr-2 h-4 w-4" />
            Assign Technician
          </DropdownMenuItem> */}
          <DropdownMenuItem>
            <CheckCircle className="mr-2 h-4 w-4" />
            Update Status
          </DropdownMenuItem>
          <Link href={`tel:${serviceRequest.address.phone}`}>
            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Call Customer
            </DropdownMenuItem>
          </Link>
          <Link href={`mailto:${serviceRequest.customer.email}`}>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}