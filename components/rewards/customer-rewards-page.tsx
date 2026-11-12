"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy } from "lucide-react"
import InfiniteScrollContainer from "@/components/common/infinite-scroll-container"
import { useRewards } from "@/hooks/use-rewards"
import RewardCard from "@/components/rewards/reward-card"
import RewardCardSkeleton from "@/components/rewards/reward-card-skeleton"
import { RewardsEmpty } from "@/components/rewards/rewards-empty"
import { parseAsString, useQueryState } from "nuqs"
import RedeemedRewardsEmpty from "@/components/rewards/redeemed-rewards-empty"
import { usePointEarningMethods } from "@/hooks/use-point-earning-methods"
import PointEarningMethodCard from "@/components/rewards/point-earning-methods/point-earning-method-card"
import { EarningMethodsEmpty } from "@/components/rewards/point-earning-methods/earning-methods-empty"
import PointEarningMethodCardSkeleton from "@/components/rewards/point-earning-methods/point-earning-method-card-skeleton"
import { useTiers } from "@/hooks/use-tiers"
import TierCard from "@/components/rewards/tiers/tier-card"
import { TiersEmpty } from "@/components/rewards/tiers/tiers-empty"
import TierCardSkeleton from "@/components/rewards/tiers/tier-card-skeleton"
import { usePointEarningHistory } from "@/hooks/use-point-earning-history"
import PointEarningHistoryCard from "./point-earning-history/point-earning-history-card"
import PointEarningHistoryEmpty from "./point-earning-history/point-earning-history-empty"
import PointEarningHistoryCardSkeleton from "./point-earning-history/point-earning-history-card-skeleton"
import { useRedeemedRewards } from "@/hooks/use-redeemed-rewards"
import RedeemedRewardCard from "./redeemed-reward-card"
import RedeemedRewardCardSkeleton from "./redeemed-reward-card-skeleton"
import { useTranslations } from "next-intl"

type Props = {
  customerPoints?: {
    points: number;
    tier: {
      id: string;
      name: string;
      color: string;
    } | null;
  }
}

export default function CustomerRewardsPage({customerPoints}:Props) {
  const t = useTranslations()
  const [tab,setTab] = useQueryState("tab",parseAsString.withDefault("rewards"))
  const rewardsQuery = useRewards({})
  const redeemedRewardsQuery = useRedeemedRewards({})
  const tiersQuery = useTiers({})
  const pointEarningMethodQuery = usePointEarningMethods({})
  const pointEarningHistoryQuery = usePointEarningHistory({})
  const nextTier = tiersQuery.data?.pages.flatMap(pg=>pg).flatMap(item=>item)
    .filter(tier=>
      tier.minPoints >= (customerPoints?.points ?? 0) 
      && customerPoints?.tier?.id !== tier.id 
    )
    .sort((a,b)=>a.minPoints - b.minPoints)
    .at(0)

  const progressPercentage = Math.min(100,((customerPoints?.points ?? 0) / Math.max(1,nextTier?.minPoints ?? 1)) * 100)


  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">{t('loyalty-rewards')}</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('earn-points-with-every-purchase-and-unlock-exclusive-rewards-the-more-you-shop-the-more-you-save')}
          </p>
        </div>

        {/* Points Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">
                {customerPoints?.points.toLocaleString() ?? 0}
              </CardTitle>
              <CardDescription>{t('available-points')}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              {
                customerPoints?.tier
                ?
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full`} style={{backgroundColor:customerPoints.tier.color}}/>
                  <CardTitle className="text-xl">{customerPoints.tier.name} {t('member')}</CardTitle>
                </div>
                :
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-black dark:bg-destructive`} />
                  <CardTitle className="text-xl">{t('not-member-of-any-tier')}</CardTitle>
                </div>
              }
              <CardDescription>{t('current-tier')}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {Math.max(0,(nextTier?.minPoints ?? 0) - (customerPoints?.points ?? 0))} {t('points-to')} {nextTier?.name}
              </CardTitle>
              <CardDescription>{t('next-tier-progress')}</CardDescription>
              <div className="mt-4">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">{Math.round(progressPercentage)}% {t("complete")}</p>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue={tab} value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="rewards">{t('available-rewards')}</TabsTrigger>
            <TabsTrigger value="my-rewards">{t('my-rewards')}</TabsTrigger>
            <TabsTrigger value="earn">{t('how-to-earn')}</TabsTrigger>
            <TabsTrigger value="tiers">{t('membership-tiers')}</TabsTrigger>
            <TabsTrigger value="history">{t('points-history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-6">
            <InfiniteScrollContainer
              query={rewardsQuery}
              keyExtractor={(reward)=>reward.id}
              renderItem={reward=><RewardCard currentPoints={customerPoints?.points ?? 0} reward={reward}/>}
              customEmptyStateComponent={<RewardsEmpty/>}
              customSkeletonComponent={<RewardCardSkeleton/>}
              containerClassName="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1"
              skeletonClassName=" bg-card h-auto"
            />
          </TabsContent>

          <TabsContent value="my-rewards" className="space-y-6">
            <InfiniteScrollContainer
              query={redeemedRewardsQuery}
              keyExtractor={(reward)=>reward.id}
              renderItem={reward=><RedeemedRewardCard reward={reward}/>}
              customEmptyStateComponent={<RedeemedRewardsEmpty/>}
              customSkeletonComponent={<RedeemedRewardCardSkeleton/>}
              containerClassName="grid gap-4 md:grid-cols-1 lg:grid-cols-1 grid-cols-1"
              skeletonClassName=" bg-card h-auto"
            />
          </TabsContent>

          <TabsContent value="earn" className="space-y-6">
            <InfiniteScrollContainer
              query={pointEarningMethodQuery}
              keyExtractor={(method)=>method.id}
              renderItem={method=><PointEarningMethodCard method={method}/>}
              customEmptyStateComponent={<EarningMethodsEmpty/>}
              customSkeletonComponent={<PointEarningMethodCardSkeleton/>}
              containerClassName="grid gap-6 md:grid-cols-2 lg:grid-cols-2 grid-cols-1"
              skeletonClassName=" bg-card h-auto"
            />
          </TabsContent>

          <TabsContent value="tiers" className="space-y-6">
            <InfiniteScrollContainer
              query={tiersQuery}
              keyExtractor={(tier)=>tier.id}
              renderItem={tier=><TierCard isCurrentTier={customerPoints?.tier?.id === tier.id} tier={tier}/>}
              customEmptyStateComponent={<TiersEmpty/>}
              customSkeletonComponent={<TierCardSkeleton/>}
              containerClassName="grid gap-4 md:grid-cols-1 lg:grid-cols-1 grid-cols-1"
              skeletonClassName=" bg-card h-auto"
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('points-history')}</CardTitle>
                <CardDescription>{t('track-your-points-earned-and-redeemed-over-time')}</CardDescription>
              </CardHeader>
              <CardContent>
                <InfiniteScrollContainer
                  query={pointEarningHistoryQuery}
                  keyExtractor={(history)=>history.id}
                  renderItem={history=><PointEarningHistoryCard transaction={history}/>}
                  customEmptyStateComponent={<PointEarningHistoryEmpty/>}
                  customSkeletonComponent={<PointEarningHistoryCardSkeleton/>}
                  containerClassName="grid gap-4 md:grid-cols-1 lg:grid-cols-1 grid-cols-1"
                  skeletonClassName=" bg-card h-auto"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
