"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { serviceRequestStatuses } from '@/db/schema/serviceRequests'
import { useLocale } from '@/hooks/use-locale'
import { getLocalizedValue } from '@/types/internationalization'
import { DetailedServiceRequest } from '@/types/serviceRequest'
import { AlertCircle, CheckCircle, Clock, Mail, MapPin, Phone, UserCheck, XCircle } from 'lucide-react'
import React, { PropsWithChildren, useState } from 'react'

type Props = {
  serviceRequest:DetailedServiceRequest
}

export const getStatusBadge = (status: string) => {
  const variants: Record<string, any> = {
    pending: { variant: "secondary", icon: Clock },
    confirmed: { variant: "default", icon: CheckCircle },
    assigned: { variant: "default", icon: UserCheck },
    "in-progress": { variant: "default", icon: AlertCircle },
    completed: { variant: "default", icon: CheckCircle },
    cancelled: { variant: "destructive", icon: XCircle },
  }

  const config = variants[status] || variants.pending
  const IconComponent = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <IconComponent className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </Badge>
  )
}

export const getUrgencyBadge = (urgency: string) => {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  return (
    <Badge className={colors[urgency as keyof typeof colors]}>
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </Badge>
  )
}


export default function ServiceRequestDetailsDialog({serviceRequest,children}: PropsWithChildren<Props>) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const locale = useLocale()
  return (
    <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Service Request Details</DialogTitle>
          <DialogDescription>Request ID: {serviceRequest?.id}</DialogDescription>
        </DialogHeader>
        {serviceRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Name:</span>
                    {serviceRequest.customer.firstName} {serviceRequest.customer.lastName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {serviceRequest.customer.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {serviceRequest.address.phone}
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{serviceRequest.address.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Service Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Service:</span> {getLocalizedValue(serviceRequest.service.nameI18n,locale)}
                  </div>
                  <div>
                    <span className="font-medium">Preferred Date:</span> {serviceRequest.timeline}
                  </div>
                  <div>
                    <span className="font-medium">Preferred Time:</span> {serviceRequest.desiredDaytime}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    {getStatusBadge(serviceRequest.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Urgency:</span>
                    {getUrgencyBadge(serviceRequest.urgency)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{serviceRequest.description}</p>
            </div>

            {/* {serviceRequest.assignedTechnician && (
              <div>
                <h3 className="font-semibold mb-2">Assigned Technician</h3>
                <div className="text-sm">
                  <Badge>{selectedRequest.assignedTechnician}</Badge>
                </div>
              </div>
            )} */}

            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <Label htmlFor="assignTechnician">Assign Technician</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name} - {tech.specialties.join(", ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div>
                <Label className=' mb-2' htmlFor="updateStatus">Update Status</Label>
                <Select defaultValue={serviceRequest.status}>
                  <SelectTrigger className=' w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      serviceRequestStatuses.map(serviceRequestStatus=>(
                        <SelectItem value={serviceRequestStatus}>{serviceRequestStatus.at(0)?.toUpperCase()}{serviceRequestStatus.slice(1)}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className=' mb-2' htmlFor="notes">Add Notes</Label>
              <Textarea id="notes" placeholder="Add internal notes..." rows={3} />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Close
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

  )
}