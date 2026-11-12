"use client"
import { RewardItem } from "@/types/reward";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { redeemReward } from "@/actions/reward";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

type Props = {
  reward:RewardItem,
  currentPoints:number
}

export default function RewardCard({reward,currentPoints}:Props){
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const redeemable = currentPoints >= reward.pointsCost
  const handleRedeemReward = async()=>{
    if(!redeemable) return
    setIsLoading(true)
    try {
      const res = await redeemReward(reward.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["redeemed-rewards"]})
        toast.success(`"${reward.name}" reward has been redeemed and can be used on your next orders.`)
        router.refresh()
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsLoading(false)
  }
  return (
    <Card className={cn("h-full",!redeemable ? "opacity-50" : "")}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{reward.name}</CardTitle>
            <CardDescription className="mt-2">{reward.description}</CardDescription>
          </div>
          <Badge variant={redeemable ? "default" : "secondary"}>{reward.pointsCost} pts</Badge>
        </div>
      </CardHeader>
      <CardContent className=" mt-auto">
        <Button
          className="w-full"
          disabled={!redeemable || isLoading}
          onClick={handleRedeemReward}
        >
          {currentPoints < reward.pointsCost ? t('not-enough-points') : t("redeem")}
        </Button>
      </CardContent>
    </Card>
    
  )
}