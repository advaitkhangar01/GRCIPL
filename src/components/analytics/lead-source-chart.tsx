
"use client"

import * as React from "react"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"


import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart";


const chartConfig = {
  count: {
    label: "Leads",
    color: "hsl(var(--chart-1))", // Use primary accent color
  },
  // Define specific colors per source if needed, otherwise uses default
  // Example:
  // Website: { label: "Website", color: "hsl(var(--chart-1))" },
  // Referral: { label: "Referral", color: "hsl(var(--chart-2))" },
  // 'RC - Pune': { label: "RC - Pune", color: "hsl(var(--chart-3))" },
  // 'GRC-Test': { label: "GRC-Test", color: "hsl(var(--chart-4))" },
  // Unknown: { label: "Unknown", color: "hsl(var(--muted))" },
} satisfies ChartConfig

interface LeadSourceChartProps {
  data: { source: string; count: number }[];
}


const LeadSourceChartComponent = ({ data }: LeadSourceChartProps) => {

export function LeadSourceChart({ data }: LeadSourceChartProps) {


   if (!data || data.length === 0) {
     return <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">No data</div>;
   }

  // Prepare data for chart, ensuring unique fill colors if defined in config
   const chartData = data.map(item => {
    const sourceKey = item.source as keyof typeof chartConfig;
    const color = chartConfig[sourceKey]?.color || chartConfig.count.color; // Fallback to default count color
    return {
      ...item,
      fill: color,
    };
   });


  return (
    <div className="h-[250px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
       <ResponsiveContainer width="100%" height="100%">
        <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="source"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            // Consider rotating labels if too many sources:
            // angle={-45} textAnchor="end" height={60} interval={0}
          />
           <YAxis allowDecimals={false} />
          <ChartTooltip
            cursor={true} // Show cursor for better hover feedback
            content={<ChartTooltipContent indicator="dot" nameKey="source" />} // Show source name in tooltip
          />
          <Bar dataKey="count" radius={4}>
             {/* Apply fill color dynamically */}
             {chartData.map((entry, index) => (
               <Cell key={`cell-${index}`} fill={entry.fill} />
             ))}
           </Bar>
        </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

export const LeadSourceChart = React.memo(LeadSourceChartComponent);


// You might need to explicitly import Cell if not automatically available
import { Cell } from "recharts";

