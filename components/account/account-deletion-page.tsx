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


export default async function AccountDeletionPage({children}:PropsWithChildren) {
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
      toast.success("Your data export has been started. You'll receive an email when it's ready.")
    } catch (error) {
      toast.error("Failed to start data export. Please try again.")
    }
  }

  const dataToDelete = [
    "Personal information (name, email, phone)",
    "Order history and purchase records",
    "Wishlist and saved items",
    "Payment methods and billing addresses",
    "Reward points and loyalty status",
    "Account preferences and settings",
    "Communication history and support tickets",
  ]


  const dataRetained = [
    "Anonymized analytics data (for business insights)",
    "Legal compliance records (as required by law)",
    "Financial transaction records (for tax purposes)",
  ]


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <div>
          <h1 className="text-2xl font-bold text-destructive">Account Scheduled for Deletion</h1>
          <p className="text-muted-foreground">Your account deletion is currently pending</p>
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
              <div className="text-sm text-muted-foreground">Deletion Requested</div>
              <div className="font-medium">{formatDate(pendingDeletionRequest.requestedAt)}</div>
            </div>
            <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="text-sm text-destructive">Scheduled Deletion</div>
              <div className="font-bold text-destructive">{formatDate(scheduledDate)}</div>
              <div className="text-sm text-destructive">at 12:00PM</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-sm text-orange-600 dark:text-orange-400">Days Remaining</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {daysRemaining}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600 dark:text-blue-400">
              You have {daysRemaining} days to cancel this deletion request
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Cancel Account Deletion</CardTitle>
          <CardDescription>You can cancel the deletion request and keep your account active</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AccountDeletionCancelButton/>
          <p className="text-sm text-muted-foreground">
            Cancelling will immediately stop the deletion process and restore full access to your account.
          </p>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Your Data
          </CardTitle>
          <CardDescription>Export a copy of your data before deletion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            // onClick={handleDownloadData} 
            className="w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Request Data Export
          </Button>
          <p className="text-sm text-muted-foreground">We'll email you a link to download your data within 24 hours.</p>
        </CardContent>
      </Card>

      {/* What Will Be Deleted */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Data to be Deleted</CardTitle>
            <CardDescription>The following information will be permanently removed</CardDescription>
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
            <CardTitle className="text-orange-600">Data Retained</CardTitle>
            <CardDescription>Some data may be retained for legal or business purposes</CardDescription>
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
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">After Deletion:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• You will not be able to recover your account or data</li>
              <li>• Any pending orders will be cancelled</li>
              <li>• Unused reward points will be forfeited</li>
              <li>• You will need to create a new account to shop with us again</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Legal Compliance:</h4>
            <p className="text-sm text-muted-foreground">
              Some data may be retained for legal, regulatory, or legitimate business purposes as outlined in our
              Privacy Policy. This includes transaction records required for tax purposes and fraud prevention.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Contact our support team if you have questions about account deletion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-muted-foreground">privacy@example.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Phone Support</div>
                <div className="text-sm text-muted-foreground">1-800-SUPPORT</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Our privacy team is available Monday-Friday, 9 AM - 6 PM EST to assist with account deletion questions and
            concerns.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
