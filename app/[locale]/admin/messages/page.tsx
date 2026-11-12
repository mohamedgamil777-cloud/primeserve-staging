import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mail,
  MailOpen,
  Archive,
  MessageSquare,
  CheckCircle,
} from "lucide-react"
import MessagesTable from "@/components/messages/messages-table"
import { getSession } from "@/lib/auth-server"
import { getTenantId } from "@/lib/tenant"
import { redirect } from "next/navigation"
import RedirectToDashboard from "@/components/common/redirect-to-dashboard"
import { db } from "@/db"
import { and, count, eq } from "drizzle-orm"
import { messages } from "@/db/schema"

export default async function AdminMessagesPage() {
  const [
    session,
    storeId
  ] = await Promise.all([
    getSession(),
    getTenantId()
  ])

  if(!session) redirect("/auth/login")
  if(session.user_role !== "seller") return <RedirectToDashboard role={session.user_role}/>

  const [
    [{readCount}],
    [{unreadCount}],
    [{respondedCount}],
    [{archivedCount}],
  ] = await Promise.all([
    db.select({"readCount":count(messages.id)}).from(messages).where(and(eq(messages.storeId,storeId),eq(messages.status,"read"))),
    db.select({"unreadCount":count(messages.id)}).from(messages).where(and(eq(messages.storeId,storeId),eq(messages.status,"unread"))),
    db.select({"respondedCount":count(messages.id)}).from(messages).where(and(eq(messages.storeId,storeId),eq(messages.status,"responded"))),
    db.select({"archivedCount":count(messages.id)}).from(messages).where(and(eq(messages.storeId,storeId),eq(messages.status,"archived"))),
  ])

  const allMessagesCount = readCount + unreadCount + respondedCount + archivedCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Messages</h1>
          <p className="text-muted-foreground">Manage and respond to customer inquiries and feedback</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allMessagesCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <MailOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{readCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responded</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{respondedCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Archive className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{archivedCount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      <MessagesTable totalMessages={allMessagesCount}/>
    </div>
  )
}
