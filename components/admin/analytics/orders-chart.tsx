"use client"

import { AnalyticData } from "@/types/analytics"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"


export function OrdersChart({ current, previous:previousData }: Pick<AnalyticData,"current"|"previous">) {
  // Combine the data for display
  const combinedData = current.map((current, index) => {
    const previous = previousData[index]
    return {
      name: current.name,
      currentOrders: current.orders,
      previousOrders: previous?.orders ?? 0,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={combinedData}>
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
        />
        <Tooltip 
          formatter={(value, name) => {
            // const formattedName = name === 'currentOrders' ? 'Current Period' : 'Previous Period'
            const formattedName = name
            return [value, formattedName]
          }} 
          labelStyle={{ color: "#000" }} 
        />
        <Legend 
          formatter={(value) => {
            // return value === 'currentOrders' ? 'Current Period' : 'Previous Period'
            return value
          }}
        />
        <Bar 
          dataKey="currentOrders" 
          name="Current Period"
          fill="#8884d8" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          dataKey="previousOrders" 
          name="Previous Period"
          fill="#82ca9d" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}