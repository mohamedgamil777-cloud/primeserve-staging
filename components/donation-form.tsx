"use client"

import type React from "react"

import { ExternalLink, Coffee, Heart, DollarSign, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DonationPlatform = {
  name: string
  description: string
  url: string
  icon: React.ReactNode
  color: string
  buttonText: string
}

export function DonationForm() {
  const donationPlatforms: DonationPlatform[] = [
    {
      name: "Ko-fi",
      description: "Buy us a coffee to keep our service running",
      url: "https://ko-fi.com/medicalbooking",
      icon: <Coffee className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      buttonText: "Support on Ko-fi",
    },
    {
      name: "Patreon",
      description: "Become a patron and support us monthly",
      url: "https://patreon.com/medicalbooking",
      icon: <Heart className="h-5 w-5" />,
      color: "bg-red-500 hover:bg-red-600",
      buttonText: "Become a Patron",
    },
    {
      name: "PayPal",
      description: "Make a one-time or recurring donation",
      url: "https://paypal.me/medicalbooking",
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-indigo-500 hover:bg-indigo-600",
      buttonText: "Donate with PayPal",
    },
    {
      name: "Direct Donation",
      description: "Support us with a credit card payment",
      url: "https://donate.medicalbooking.com",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-emerald-500 hover:bg-emerald-600",
      buttonText: "Donate Directly",
    },
  ]

  const handleDonationClick = (platform: DonationPlatform) => {
    // In a real app, you might want to track donation clicks
    console.log(`User clicked on ${platform.name} donation`)
    window.open(platform.url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium">Support Our Mission</h3>
        <p className="text-muted-foreground">
          Your support helps us maintain this platform and keep it free for patients. Choose your preferred way to
          donate:
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {donationPlatforms.map((platform) => (
          <Card key={platform.name} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-full ${platform.color.split(" ")[0].replace("bg-", "bg-opacity-20")} text-${platform.color.split("-")[1]}-500`}
                >
                  {platform.icon}
                </div>
                {platform.name}
              </CardTitle>
              <CardDescription>{platform.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-3">
              <Button className={cn("w-full text-white", platform.color)} onClick={() => handleDonationClick(platform)}>
                {platform.buttonText}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground mt-6">
        <p>
          Your donations are what keep this service free and accessible to everyone.
          <br />
          Thank you for your generosity and support!
        </p>
        <div className="flex items-center justify-center mt-2">
          <Heart className="h-4 w-4 text-red-500 mr-1" />
          <span>From the entire Medical Booking team</span>
        </div>
      </div>
    </div>
  )
}

