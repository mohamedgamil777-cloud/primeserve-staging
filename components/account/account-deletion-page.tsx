import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Calendar, Clock, Shield, Download, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import AccountDeletionCancelButton from "@/components/account/account-deletion-cancel-button"
import { db } from "@/db"
import { getSession } from "@/lib/auth-server"
import { PropsWithChildren } from "react"
import { differenceInDays } from "date-fns"
import { formatDate, getDateNDaysFrom } from "@/lib/date"


export default async function AccountDeletionPage({children, locale}:PropsWithChildren<{ locale: string }>) {
  const tu = await getTranslations({ locale, namespace: "ui" })
  const [session] = await Promise.all([
    getSession(),
    
  ])
  const pendingDeletionRequest = await db.query.accountDeletionRequests.findFirst({
    "where":(accountDeletionRequests,{eq,and})=>and(
      eq(accountDeletionRequests.userId,session?.user_id!),
      eq(accountDeletionRequests.status,"pending"),
    )
  })

  if(!pendingDeletionRequest) return children

  const scheduledDate = getDateNDaysFrom(pendingDeletionRequest.requestedAt,30)
  const daysRemaining = differenceInDays(scheduledDate,new Date())

  const handleDownloadData = async () => {
    try {
      // Simulate data download
      toast.success(tu("exportStarted"))
    } catch (error) {
      toast.error(tu("exportFailed"))
    }
  }

  const dataToDelete = [
    tu("del1"),
    tu("del2"),
    tu("del3"),
    tu("del4"),
    tu("del5"),
    tu("del6"),
    tu("del7"),
  ]


  const dataRetained = [
    tu("ret1"),
    tu("ret2"),
    tu("ret3"),
  ]


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <div>
          <h1 className="text-2xl font-bold text-destructive">{tu("delScheduledTitle")}</h1>
          <p className="text-muted-foreground">{tu("delPending")}</p>
        </div>
      </div>

      {/* Deletion Timeline */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Deletion Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">{tu("delRequested")}</div>
              <div className="font-medium">{formatDate(pendingDeletionRequest.requestedAt)}</div>
            </div>
            <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="text-sm text-destructive">{tu("delScheduled")}</div>
              <div className="font-bold text-destructive">{formatDate(scheduledDate)}</div>
              <div className="text-sm text-destructive">{tu("at12")}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-sm text-orange-600 dark:text-orange-400">{tu("daysRemaining")}</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {daysRemaining}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {tu("daysToCancel", { days: daysRemaining })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>{tu("cancelDeletion")}</CardTitle>
          <CardDescription>{tu("cancelDeletionText")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AccountDeletionCancelButton/>
          <p className="text-sm text-muted-foreground">
            {tu("cancellingText")}
          </p>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {tu("downloadData")}
          </CardTitle>
          <CardDescription>{tu("exportCopy")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            // onClick={handleDownloadData} 
            className="w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {tu("requestExport")}
          </Button>
          <p className="text-sm text-muted-foreground">{tu("exportEmail")}</p>
        </CardContent>
      </Card>

      {/* What Will Be Deleted */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">{tu("dataDeleted")}</CardTitle>
            <CardDescription>{tu("dataDeletedText")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dataToDelete.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">{tu("dataRetained")}</CardTitle>
            <CardDescription>{tu("dataRetainedText")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dataRetained.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Important Information */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Shield className="h-5 w-5" />
            {tu("importantInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">{tu("afterDeletion")}</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>{tu("after1")}</li>
              <li>{tu("after2")}</li>
              <li>{tu("after3")}</li>
              <li>{tu("after4")}</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">{tu("legalCompliance")}</h4>
            <p className="text-sm text-muted-foreground">
              {tu("legalText")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>{tu("needHelp")}</CardTitle>
          <CardDescription>{tu("deletionHelpText")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href={`/${locale}/contact`}><Mail className="h-4 w-4 me-2" />{tu("contactUs")}</Link></Button>
            <Button asChild variant="outline"><Link href={`/${locale}/support`}><Phone className="h-4 w-4 me-2" />{tu("supportHub")}</Link></Button>
          </div>
          <p className="text-sm text-muted-foreground">{tu("deletionHelpLinks")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
