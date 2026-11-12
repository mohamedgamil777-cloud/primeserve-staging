"use client"

import { useAnalytics } from "@/hooks/use-analytics"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function AdminRecentSales() {
  const { data } = useAnalytics("year")
  const { current } = data ?? {}
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={current ?? []}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="orders" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
