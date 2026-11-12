"use client"

import { AnalyticData } from "@/types/analytics"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"


export function CustomerAnalytics({ current:currentData, previous:previousData }: Pick<AnalyticData,"current"|"previous">) {
  // Combine the data for display
  const combinedData = currentData.map((current, index) => {
    const previous = previousData[index]
    return {
      name: current.name,
      currentNewCustomers: current.newCustomers,
      currentReturningCustomers: current.returningCustomers,
      previousNewCustomers: previous?.newCustomers ?? 0,
      previousReturningCustomers: previous?.returningCustomers ?? 0,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={combinedData}>
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
            // const formattedName = name.includes('New') 
            //   ? (name.includes('current') ? 'New (Current)' : 'New (Previous)')
            //   : (name.includes('current') ? 'Returning (Current)' : 'Returning (Previous)')
            return [value, name]
          }}
          labelStyle={{ color: "#000" }}
        />
        <Legend 
          formatter={(value) => {
            // if (value === 'currentNewCustomers') return 'New (Current)'
            // if (value === 'currentReturningCustomers') return 'Returning (Current)'
            // if (value === 'previousNewCustomers') return 'New (Previous)'
            // return 'Returning (Previous)'
            return value
          }}
        />
        {/* Current Period Areas */}
        <Area 
          type="monotone" 
          dataKey="currentNewCustomers" 
          name="New (Current)"
          stackId="1" 
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.6} 
        />
        <Area
          type="monotone"
          dataKey="currentReturningCustomers"
          name="Returning (Current)"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        {/* Previous Period Areas (with different opacity) */}
        <Area 
          type="monotone" 
          dataKey="previousNewCustomers" 
          name="New (Previous)"
          stackId="2" 
          stroke="#4444d8" 
          fill="#4444d8" 
          fillOpacity={0.3}
          strokeDasharray="5 5"
        />
        <Area
          type="monotone"
          dataKey="previousReturningCustomers"
          name="Returning (Previous)"
          stackId="2"
          stroke="#42ca4d"
          fill="#42ca4d"
          fillOpacity={0.3}
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}