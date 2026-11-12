"use client"
import { useTranslations } from "next-intl"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle, AlertCircle, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "next-intl"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { verifyEmail, resendVerificationEmail as sendVerificationEmail } from "@/actions/auth"
import { toast } from "sonner"

export default function VerifyEmailPage({resendEmailOnMount}:{resendEmailOnMount?:boolean}) {
  const tu = useTranslations("ui")
  const locale = useLocale()
  const [verificationToken, setVerificationToken] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error" | "pending">("pending")
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  useEffect(() => {
    if (token) {
      setVerificationToken(token)
    }
  }, [token])

  useEffect(()=>{
    if(verificationToken.length === 6 && verificationStatus === "pending") handleVerifyEmail(verificationToken)
  },[verificationToken])

  useEffect(()=>{
    if(resendEmailOnMount && !isResending) resendVerificationEmail()
  },[])

  const handleVerifyEmail = async (verificationToken: string) => {
    setVerificationStatus("loading")

    try {
      const res = await verifyEmail(verificationToken)
      if(res.error){
        setVerificationStatus("error")
        toast.error(res.error)
      }else{
        setVerificationStatus("success")
        toast.success(tu("verifiedToast"),)
      }
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/account")
      }, 3000)
    } catch (error) {
      setVerificationStatus("error")
      toast.error(tu("verifyFailedToast"))
    }
  }

  const resendVerificationEmail = async () => {
    setIsResending(true)

    try {
      const res = await sendVerificationEmail()
      if(res.error) toast.error(res.error)
      else toast.success(tu("verifySentToast"))
    } catch (error) {
      toast.error(tu("verifySendFailed"))
    } finally {
      setIsResending(false)
    }
  }

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href={`/${locale}/`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to store
            </Link>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <h3 className="text-lg font-semibold">{tu("verifying")}</h3>
                <p className="text-sm text-muted-foreground">{tu("verifyingText")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href={`/${locale}/`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to store
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>{tu("verifiedTitle")}</CardTitle>
              <CardDescription>{tu("verifiedText")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  You will be redirected to the sign in page in a few seconds.
                </p>
                <Button asChild className="w-full">
                  <Link href={`/${locale}/auth/login`}>{tu("signInToAccount")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href={`/${locale}/`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to store
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>{tu("verifyFailedTitle")}</CardTitle>
              <CardDescription>{tu("verifyFailedText")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Verification links expire after 10 minutes for security reasons.
                </p>
                <Button onClick={()=>{
                  setVerificationToken("")
                  setVerificationStatus("pending")
                }} disabled={isResending} className="w-full">
                  Re-Enter verification Code
                </Button>
                <Button variant={"outline"} onClick={resendVerificationEmail} disabled={isResending} className="w-full">
                  {isResending ? tu("sending") : tu("sendNewVerification")}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground w-full">
                Need help?{" "}
                <Link href={`/${locale}/contact`} className="font-medium text-primary hover:underline">
                  Contact support
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Default state - no token provided
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href={`/${locale}/`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to store
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{tu("verifyYourEmail")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{tu("checkEmailForLink")}</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>{tu("checkYourEmail")}</CardTitle>
            <CardDescription>We've sent a verification link to {email || "your email address"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Click the link in the email or enter the code below to verify your account. If you don't see it, check your spam folder.
              </p>
              <InputOTP
                className=" mx-auto w-full"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={verificationToken}
                onChange={setVerificationToken}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button onClick={()=>handleVerifyEmail(verificationStatus)} disabled={isResending || verificationToken.length !== 6} variant="default" className="w-full">
                {isResending ? tu("verifyingShort") : tu("verifyCode")}
              </Button>
              <Button onClick={resendVerificationEmail} disabled={isResending} variant="outline" className="w-full">
                {isResending ? tu("sending") : tu("resendVerification")}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Already verified?{" "}
              <Link href={`/${locale}/auth/login`} className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
