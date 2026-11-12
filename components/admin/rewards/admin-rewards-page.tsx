"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Users, TrendingUp, Award } from "lucide-react"
import { AdminRewardsOverview } from "@/components/admin/rewards/admin-rewards-overview"
import { AdminRewardsList } from "@/components/admin/rewards/admin-rewards-list"
import { AdminTiersList } from "@/components/admin/rewards/tiers/admin-tiers-list"
import { AdminEarningMethodsList } from "@/components/admin/rewards/point-earning-methods/admin-earning-methods-list"
import { parseAsString, useQueryState } from "nuqs"

type Props = {
  totalMembers:number,
  pointsIssued:number,
  pointsRedeemed:number,
  activeRewards:number,
}

export default function AdminRewardsPage({totalMembers,pointsIssued,pointsRedeemed,activeRewards}:Props) {
  const [tab,setTab] = useQueryState("tab",parseAsString.withDefault("rewards"))
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rewards Management</h1>
        <p className="text-muted-foreground">Manage your loyalty program, rewards, tiers, and earning methods.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">+12.5% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pointsIssued.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">+8.2% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pointsRedeemed.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">+15.3% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rewards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRewards.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">3 new this month</p> */}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={tab} value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger disabled value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="tiers">Membership Tiers</TabsTrigger>
          <TabsTrigger value="earning">Earning Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AdminRewardsOverview />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <AdminRewardsList />
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <AdminTiersList />
        </TabsContent>

        <TabsContent value="earning" className="space-y-4">
          <AdminEarningMethodsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
