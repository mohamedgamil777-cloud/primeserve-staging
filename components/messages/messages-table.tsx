"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Archive, MailOpen, MoreHorizontal, Reply, Search, Star, StarOff } from 'lucide-react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useMessages, useUpdateMessage } from '@/hooks/use-messages'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { messageCategory, messageCategoryLabels, messagePriority, messagePriorityColors, messageStatus, messageStatusColors } from '@/db/schema/messages'
import { ContactMessageCategory, ContactMessagePriority, ContactMessageStatus } from '@/types/message'
import InfiniteScrollTable from '../common/infinite-scroll-table'
import { Button } from '../ui/button'
import MessageDetailDialog from './message-detail-dialog'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { toast } from 'sonner'

type Props = {
  totalMessages:number
}

export default function MessagesTable({totalMessages}: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const debouncedSearchTerm = useDebouncedValue(searchTerm,1000)
  const updateMessage = useUpdateMessage().mutate
  


  const query = useMessages({
    "query":debouncedSearchTerm,
    "category":messageCategory.includes(categoryFilter as ContactMessageCategory) ? categoryFilter as ContactMessageCategory : undefined,
    "priority":messagePriority.includes(priorityFilter as ContactMessagePriority) ? priorityFilter as ContactMessagePriority : undefined,
    "status":messageStatus.includes(statusFilter as ContactMessageStatus) ? statusFilter as ContactMessageStatus : undefined,
  })



  const handleMessageStarToggle = (messageId: string,newState:boolean) => {
    try {
      updateMessage({"id":messageId,"isStarred":newState})
    } catch (error) {
      toast.error("something went wrong, try again later.")    
    }
  }

  const handleMessageStatusChange = (messageId: string, newStatus: string) => {
    updateMessage({"id":messageId,"status":newStatus as ContactMessageStatus})
    toast.success(`Message marked as ${newStatus}`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className=' w-full'>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className=' w-full'>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>All Categories</SelectItem>
                  {
                    messageCategory.map(mc=>(
                      <SelectItem key={mc} value={mc}>{messageCategoryLabels[mc]}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className=' w-full'>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({totalMessages})</CardTitle>
          <CardDescription>Click on a message to view details and respond</CardDescription>
        </CardHeader>
        <CardContent>
          <InfiniteScrollTable
            query={query}
            cols={[
              {
                "order":1,
                "head":"",
                "cellClassName":()=>"text-left",
                "cell":(allMessages,message)=>(
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMessageStarToggle(message.id,!message.isStarred)
                    }}
                  >
                    {message.isStarred ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                ),
              },
              {
                "order":2,
                "head":"Customer",
                "cellClassName":()=>"text-left",
                "cell":(allMessages,message)=>(
                  <MessageDetailDialog message={message}>
                    <div className="space-y-1">
                      <div className="font-medium">{message.name}</div>
                      <div className="text-sm text-muted-foreground">{message.email}</div>
                    </div>
                  </MessageDetailDialog>
                ),
              },
              {
                "order":3,
                "head":"Subject",
                "cellClassName":()=>"text-left",
                "cell":(allMessages,message)=>(
                  <MessageDetailDialog message={message}>
                    <div className="max-w-[200px] truncate font-medium">{message.subject}</div>
                  </MessageDetailDialog>
                ),
              },
              {
                "order":4,
                "head":"Category",
                "cellClassName":()=>"text-left",
                "cell":(allMessages,message)=>(
                  <MessageDetailDialog message={message}>
                    <Badge variant="outline">{messageCategoryLabels[message.category as keyof typeof messageCategoryLabels]}</Badge>
                  </MessageDetailDialog>
                ),
              },
              {
                "order":5,
                "head":"Priority",
                "cellClassName":()=>"text-left",
                "cell":(allMessages,message)=>(
                  <MessageDetailDialog message={message}>
                    <Badge className={messagePriorityColors[message.priority as keyof typeof messagePriorityColors]}>
                      {message.priority}
                    </Badge>
                  </MessageDetailDialog>
                ),
              },
              {
                "order":6,
                "head":"Status",
                "cellClassName":()=>"text-left",
                "cell":(allMessages,message)=>(
                  <MessageDetailDialog message={message}>
                    <Badge className={messageStatusColors[message.status as keyof typeof messageStatusColors]}>
                      {message.status}
                    </Badge>
                  </MessageDetailDialog>
                ),
              },
              {
                "order":7,
                "head":"Date",
                "cellClassName":()=>"text-left",
                "cell":(allMessages,message)=>(
                  <MessageDetailDialog message={message}>
                    <div className="text-sm">{new Date(message.createdAt).toLocaleDateString()}</div>
                  </MessageDetailDialog>
                ),
              },
              {
                "order":8,
                "head":"",
                "cellClassName":()=>"w-[50px]",
                "cell":(allMessages,message)=>(
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleMessageStatusChange(message.id, "read")}>
                        <MailOpen className="mr-2 h-4 w-4" />
                        Mark as Read
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMessageStatusChange(message.id, "responded")}>
                        <Reply className="mr-2 h-4 w-4" />
                        Mark as Responded
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMessageStatusChange(message.id, "archived")}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ),
              },
            ]}
            rowClassName='cursor-pointer hover:bg-muted/50'
          />
        </CardContent>
      </Card>
    </>
  )
}