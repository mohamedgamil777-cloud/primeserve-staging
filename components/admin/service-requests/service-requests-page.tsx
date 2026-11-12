"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useServiceRequests } from "@/hooks/use-service-requests"
import InfiniteScrollTable from "@/components/common/infinite-scroll-table"
import { getStatusBadge, getUrgencyBadge } from "@/components/admin/service-requests/service-request-details-dialog"
import ServiceRequestRowActions from "@/components/admin/service-requests/service-request-row-actions"
import { serviceRequestStatuses, serviceRequestUrgencies } from "@/db/schema/serviceRequests"
import { ServiceRequestStatus, ServiceRequestUrgency } from "@/types/serviceRequest"
import { useLocale } from "@/hooks/use-locale"
import { getLocalizedValue } from "@/types/internationalization"


type Props = {
  pendingCount:number,
  confirmedCount:number,
  inProgressCount:number,
  completedCount:number,

}

export default function ServiceRequestsPage({pendingCount,confirmedCount,inProgressCount,completedCount}:Props) {
  const locale = useLocale()
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const query = useServiceRequests({
    "status": statusFilter && statusFilter !== "all" ? (statusFilter as ServiceRequestStatus) : undefined,
    "urgency": urgencyFilter && urgencyFilter !== "all" ? (urgencyFilter as ServiceRequestUrgency) : undefined
  })


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Service Requests</h1>
        <p className="text-muted-foreground">Manage customer service requests and assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
          <CardDescription>View and manage all service requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div> */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {
                  serviceRequestStatuses.map(serviceRequestStatus=>(
                    <SelectItem key={serviceRequestStatus} value={serviceRequestStatus}>{serviceRequestStatus.at(0)?.toUpperCase()}{serviceRequestStatus.slice(1)}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                {
                  serviceRequestUrgencies.map(serviceRequestUrgency=>(
                    <SelectItem key={serviceRequestUrgency} value={serviceRequestUrgency}>{serviceRequestUrgency.at(0)?.toUpperCase()}{serviceRequestUrgency.slice(1)}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <InfiniteScrollTable
              query={query}
              cols={[
                {
                  "order":1,
                  "head":"Customer",
                  "cell":(allRequests,request)=>(
                    <div>
                      <div className="font-medium">{request.customer.firstName} {request.customer.lastName}</div>
                      <div className="text-sm text-muted-foreground">{request.customer.email}</div>
                    </div>
                  ),
                  "cellClassName":()=>"font-medium text-left"
                },
                {
                  "order":2,
                  "head":"Service",
                  "cell":(allRequests,request)=>(
                    getLocalizedValue(request.service.nameI18n,locale)
                  ),
                  "cellClassName":()=>"font-medium text-left"
                },
                {
                  "order":3,
                  "head":"Date",
                  "cell":(allRequests,request)=>(
                    <div>
                      <div>{request.timeline}</div>
                      <div className="text-sm text-muted-foreground">{request.desiredDaytime}</div>
                    </div>
                  ),
                  "cellClassName":()=>"font-medium text-left"
                },
                {
                  "order":4,
                  "head":"Status",
                  "cell":(allRequests,request)=>(
                    getStatusBadge(request.status)
                  ),
                  "cellClassName":()=>"font-medium text-left"
                },
                {
                  "order":5,
                  "head":"Urgency",
                  "cell":(allRequests,request)=>(
                    getUrgencyBadge(request.urgency)
                  ),
                  "cellClassName":()=>"font-medium text-left"
                },
                {
                  "order":6,
                  "head":"Technician",
                  "cell":(allRequests,request)=>(
                    <Badge variant="outline">Unassigned</Badge>
                  ),
                  "cellClassName":()=>"font-medium text-left"
                },
                {
                  "order":7,
                  "head":"Cost",
                  "cell":(allRequests,request)=>(
                    <div>
                      {request.budget && <div className="text-sm">Budget: ${request.budget}</div>}
                      {request.budget && <div className="font-medium">Act: {request.service.pricingModel === "fixed" ? `$${request.service.price}` : " Needs Quote"}</div>}
                    </div>
                  ),
                  "cellClassName":()=>"font-medium text-left"
                },
                {
                  "order":8,
                  "head":"",
                  "headClassName":"w-[50px]",
                  "cell":(allRequests,request)=>(
                    <ServiceRequestRowActions serviceRequest={request}/>
                  ),
                  "cellClassName":()=>"font-medium text-left"
                },
              ]}
            />            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
