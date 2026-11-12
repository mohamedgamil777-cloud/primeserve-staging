"use client"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { formatDate, getPromotionStatus } from "@/lib/promotion-utils"
import { PromotionCodeStatus } from "@/types/promotionCode"
import { parseAsString, useQueryState } from "nuqs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { usePromotionCodes } from "@/hooks/use-promotion-codes"
import InfiniteScrollTable from "@/components/common/infinite-scroll-table"
import PromotionCodeRowActions from "./promotion-code-row-actions"

type PromotionsTableProps = {
  status: PromotionCodeStatus
}

export function PromotionsTable({ status }: PromotionsTableProps) {
  const [searchQuery, setSearchQuery] = useQueryState("q",parseAsString.withDefault(""))
  const debouncedSearchQuery = useDebouncedValue(searchQuery,1000)

  const query = usePromotionCodes({
    "query":debouncedSearchQuery,
    status
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search promotions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <InfiniteScrollTable
          query={query}
          cols={[
            {
              "order":1,
              "head":"Code",
              "cell":(all,promotion)=>(`#${promotion.code}`),
              "cellClassName":()=>"font-mono font-medium text-left"
            },
            {
              "order":2,
              "head":"Type",
              "cellClassName":()=>"text-left capitalize",
              "cell":(all,promotion)=>(
                promotion.type === "percentage"
                  ? "% Discount"
                  : promotion.type === "fixed"
                    ? "Fixed Amount"
                    : promotion.type === "shipping"
                      ? "Free Shipping"
                      : promotion.type
              ),
            },
            {
              "order":3,
              "head":"Value",
              "cellClassName":()=>"text-left",
              "cell":(all,promotion)=>(
                promotion.type === "percentage"
                  ? `${promotion.value}%`
                  : promotion.type === "fixed"
                    ? `EGP ${promotion.value}`
                    : promotion.type === "shipping"
                      ? "Free"
                      : promotion.value
              ),
            },
            {
              "order":4,
              "head":"Min. Purchase",
              "cellClassName":()=>"text-left",
              "cell":(all,promotion)=>promotion.minPurchase && promotion.minPurchase > 0 ? `EGP ${promotion.minPurchase?.toLocaleString()}` : "None",
            },
            {
              "order":5,
              "head":"Usage",
              "cellClassName":()=>"text-left",
              "cell":(all,promotion)=>`${promotion.usageCount} / ${promotion.usageLimit || "∞"}`,
            },
            {
              "order":6,
              "head":"Validity",
              "cellClassName":()=>"text-left",
              "cell":(all,promotion)=>(
                <div className="text-xs">
                  <div>{promotion.startDate ? formatDate(String(promotion.startDate)) : "Always"} -</div>
                  <div>{promotion.endDate ? formatDate(String(promotion.endDate)) : "No expiry"}</div>
                </div>

              ),
            },
            {
              "order":7,
              "head":"Status",
              "headClassName":"text-right",
              "cell":(all,promotion)=>{
                const status = getPromotionStatus(promotion)
                return (
                  <Badge
                    variant={
                      status === "active"
                        ? "default"
                        : status === "scheduled"
                          ? "outline"
                          : status === "expired"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {status === "active"
                      ? "Active"
                      : status === "scheduled"
                        ? "Scheduled"
                        : status === "expired"
                          ? "Expired"
                          : "Disabled"}
                  </Badge>
                )
              },
            },
            {
              "order":8,
              "head":"Actions",
              "headClassName":"text-right",
              "cell":(all,promotion)=>(
                <PromotionCodeRowActions promotion={promotion}/>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
