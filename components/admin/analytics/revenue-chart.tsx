"use client"

import { AnalyticData } from "@/types/analytics"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

export function RevenueChart({ current:currentData, previous:previousData }: Pick<AnalyticData,"current"|"previous">) {
  // Combine the data for display
  const combinedData = currentData.map((current, index) => {
    const previous = previousData[index]
    return {
      name: current.name,
      currentRevenue: current.revenue,
      previousRevenue: previous?.revenue ?? 0,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={combinedData}>
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value, name) => {
            // const formattedName = name === 'currentRevenue' ? 'Current Period' : 'Previous Period'
            const formattedName = name
            return [`$${value}`, formattedName]
          }} 
          labelStyle={{ color: "#000" }} 
        />
        <Legend 
          // formatter={(value) => {
          //   return value === 'currentRevenue' ? 'Current Period' : 'Previous Period'
          // }}
        />
        <Line 
          type="monotone"
          dataKey="currentRevenue"
          name="Current Period"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ fill: "#8884d8" }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone"
          dataKey="previousRevenue"
          name="Previous Period"
          stroke="#82ca9d"
          strokeWidth={2}
          strokeDasharray="5 5"  // Dashed line for previous period
          dot={{ fill: "#82ca9d" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}