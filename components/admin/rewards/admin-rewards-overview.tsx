"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const tierDistribution = [
  { tier: "Bronze", count: 1847, percentage: 65, color: "bg-amber-600" },
  { tier: "Silver", count: 672, percentage: 24, color: "bg-gray-400" },
  { tier: "Gold", count: 284, percentage: 10, color: "bg-yellow-500" },
  { tier: "Platinum", count: 44, percentage: 1, color: "bg-purple-600" },
]

const topRewards = [
  { name: "$5 Off Next Purchase", redeemed: 1247, points: 500 },
  { name: "Free Shipping", redeemed: 892, points: 200 },
  { name: "$10 Off Next Purchase", redeemed: 634, points: 1000 },
  { name: "Early Access to Sales", redeemed: 423, points: 300 },
  { name: "$25 Off Next Purchase", redeemed: 156, points: 2500 },
]

const recentActivity = [
  { user: "Sarah Johnson", action: "Redeemed $5 Off", points: -500, time: "2 minutes ago" },
  { user: "Mike Chen", action: "Earned points from purchase", points: 150, time: "5 minutes ago" },
  { user: "Emma Davis", action: "Redeemed Free Shipping", points: -200, time: "12 minutes ago" },
  { user: "Alex Rodriguez", action: "Earned points from review", points: 50, time: "18 minutes ago" },
  { user: "Lisa Wang", action: "Tier upgraded to Gold", points: 0, time: "25 minutes ago" },
]

export function AdminRewardsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Membership Tier Distribution</CardTitle>
          <CardDescription>Current distribution of members across tiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tierDistribution.map((tier) => (
            <div key={tier.tier} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{tier.tier}</span>
                <span className="text-muted-foreground">
                  {tier.count} members ({tier.percentage}%)
                </span>
              </div>
              <Progress value={tier.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Redeemed Rewards</CardTitle>
          <CardDescription>Most popular rewards this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRewards.map((reward, index) => (
              <div key={reward.name} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">{reward.points} points</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{reward.redeemed}</p>
                  <p className="text-xs text-muted-foreground">redeemed</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest loyalty program activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <div className="text-right">
                  {activity.points !== 0 && (
                    <Badge variant={activity.points > 0 ? "default" : "secondary"}>
                      {activity.points > 0 ? "+" : ""}
                      {activity.points} pts
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
