"use client"
import { ContactMessage, ContactMessagePriority, ContactMessageStatus } from '@/types/message'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Clock, Mail, Phone, Reply, Star, StarOff, User } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'
import { messagePriority, messagePriorityColors, messagePriorityLabels, messageStatus, messageStatusLabels } from '@/db/schema/messages'
import { useUpdateMessage } from '@/hooks/use-messages'
import { replyToMessage } from '@/actions/mail'

type Props = {
  message:ContactMessage
}

export default function MessageDetailDialog({message,children}: PropsWithChildren<Props>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [adminNotes, setAdminNotes] = useState(message.adminNotes ?? "")
  const updateMessage = useUpdateMessage().mutate

  useEffect(()=>{setAdminNotes(message.adminNotes)},[message.adminNotes])

  const handleReply = async () => {
    setIsReplying(true)
    try {      
      const res = await replyToMessage(message.id,replyText)
      if(res.error) toast.error(res.error)
      else{
        updateMessage({"id":message.id,"responseCount":(message.responseCount ?? 0) + 1})
        setReplyText("")
        toast.success("Reply sent successfully")
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsReplying(false)
  }

  const handleMessageStarToggle = (messageId: string,newState:boolean) => {
    try {
      updateMessage({"id":messageId,"isStarred":newState})
      if(newState) toast.success("Message has been stared")
      else toast.success("Message has been unstared")
    } catch (error) {}
  }

  const handleMessageStatusChange = (messageId: string, newStatus: string) => {
    updateMessage({"id":messageId,"status":newStatus as ContactMessageStatus})
    toast.success(`Message marked as ${newStatus}`)
  }

  const handleMessagePriorityChange = (messageId: string, newPriority: string) => {
    updateMessage({"id":messageId,"priority":newPriority as ContactMessagePriority})
    toast.success(`Message priority has been changed to ${newPriority}`)
  }

  const handleNotesUpdate = () => {
    updateMessage({"id":message.id,"adminNotes":adminNotes})
    toast.success("Notes updated successfully")
  }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {
          children
        }
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {message.subject}
            <Badge className={messagePriorityColors[message.priority as keyof typeof messagePriorityColors]}>
              {message.priority} priority
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Message from {message.name} • {new Date(message.createdAt!).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="message" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="reply">Reply</TabsTrigger>
            <TabsTrigger value="notes">Admin Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="message" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{message.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{message.email}</span>
                  </div>
                  {message.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{message.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(message.createdAt!).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Message Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">{message.message}</div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Select
                value={message.status}
                onValueChange={(value) => handleMessageStatusChange(message.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {
                    messageStatus.map(mp=>(
                      <SelectItem key={mp} value={mp}>{messageStatusLabels[mp]}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <Select
                value={message.priority}
                onValueChange={(value) => handleMessagePriorityChange(message.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {
                    messagePriority.map(mp=>(
                      <SelectItem key={mp} value={mp}>{messagePriorityLabels[mp]}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleMessageStarToggle(message.id,!message.isStarred)}>
                {message.isStarred ? (
                  <>
                    <StarOff className="mr-2 h-4 w-4" />
                    Unstar
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Star
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reply" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Send Reply</CardTitle>
                <CardDescription>Reply will be sent to {message.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reply">Your Reply</Label>
                  <Textarea
                    id="reply"
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button onClick={handleReply} disabled={!replyText.trim() || isReplying}>
                  <Reply className="mr-2 h-4 w-4" />
                  Send Reply
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Notes</CardTitle>
                <CardDescription>Internal notes for this message (not visible to customer)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add internal notes about this message..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleNotesUpdate}>Save Notes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}