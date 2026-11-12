"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromotionStats } from "@/components/admin/promotions/promotion-stats"
import { PromotionsTable } from "@/components/admin/promotions/promotions-table"
import { CreatePromotionDialog } from "@/components/admin/promotions/create-promotion-dialog"
import { promotionCodeStatuses } from "@/types/promotionCode"
import { parseAsString, useQueryState } from "nuqs"

type Props = {
  totalPromotions:number,
  activePromotions:number,
  totalRedemptions:number,
  uniqueCustomers:number
}
export default function PromotionsPage(props:Props) {
  const [activeTab, setActiveTab] = useQueryState("tab",parseAsString.withDefault("all"))

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
        <p className="text-muted-foreground">Create and manage promotion codes for your store.</p>
      </div>

      <PromotionStats {...props}/>

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
            <TabsList>
              {
                promotionCodeStatuses.map(t=>(
                  <TabsTrigger key={t} value={t}>{
                    t === "all" ? "All Promotions" : `${t.at(0)?.toUpperCase()}${t.slice(1)}`
                  }</TabsTrigger>
                ))
              }
            </TabsList>
          <div className="ml-auto">
            <CreatePromotionDialog/>
          </div>
        </div>
        {
          promotionCodeStatuses.map(status=>(
            <TabsContent key={status} value={status} className="m-0">
              <PromotionsTable status={status} />
            </TabsContent>
          ))
        }
      </Tabs>
    </div>
  )
}
