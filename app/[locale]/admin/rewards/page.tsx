import AdminRewardsPage from "@/components/admin/rewards/admin-rewards-page"
import { db } from "@/db"
import { customerPointLogs, customerPoints, rewards } from "@/db/schema"
import { getTenantId } from "@/lib/tenant"
import { and, count, eq } from "drizzle-orm"

export default async function page() {
  const storeId = await getTenantId()
  const [
    [activeRewards],
    [totalMembers],
    pointLogs
  ] = await Promise.all([
    db.select({"count":count()}).from(rewards).where(and(
      eq(rewards.storeId,storeId),
      eq(rewards.isActive,true)
    )),
    db.select({"count":count()}).from(customerPoints).where(eq(customerPoints.storeId,storeId)),
    db.select({"type":customerPointLogs.type,"points":customerPointLogs.points}).from(customerPointLogs).where(eq(customerPointLogs.storeId,storeId))
  ])
  return (
    <AdminRewardsPage
      activeRewards={activeRewards.count}
      totalMembers={totalMembers.count}
      pointsIssued={pointLogs.filter(point=>point.type === "earn").reduce((acc,cur)=>acc+cur["points"],0)}
      pointsRedeemed={pointLogs.filter(point=>point.type === "redeem").reduce((acc,cur)=>acc+cur["points"],0)}
    />
  )
}
