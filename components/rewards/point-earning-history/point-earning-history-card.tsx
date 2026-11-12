import { CustomerPointLog } from '@/types/customerPointLogs'
import React from 'react'

type Props = {
  transaction:CustomerPointLog
}

export default function PointEarningHistoryCard({transaction}: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            transaction.type === "earn" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {transaction.type === "earn" ? "+" : "-"}
        </div>
        <div>
          <p className="font-medium">{transaction.type === "earn" ? transaction.method?.name : transaction.reward?.name}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(transaction.createdAt!).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div
        className={`font-semibold ${transaction.type === "earn" ? "text-green-600" : "text-red-600"}`}
      >
        {transaction.type === "earn" ? "+" : ""}
        {transaction.points} pts
      </div>
    </div>
  )
}