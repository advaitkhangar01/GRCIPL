
"use client"

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts" // Import Tooltip

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart";


const chartConfig = {
  assigned: {
    label: "Assigned",
    color: "hsl(var(--chart-2))",
  },
  prospects: {
    label: "Prospects",
    color: "hsl(var(--chart-1))",
  },
  won: {
    label: "Won",
    color: "hsl(var(--chart-3))", // Use a distinct color for won
  },
} satisfies ChartConfig

interface EmployeePerformanceChartProps {
  data: { employee: string; assigned: number; prospects: number; won: number }[];
}

<<<<<<< HEAD
const EmployeePerformanceChartComponent = ({ data }: EmployeePerformanceChartProps) => {
=======
export function EmployeePerformanceChart({ data }: EmployeePerformanceChartProps) {
>>>>>>> 573bb45a (Initial project push)

  if (!data || data.length === 0) {
     return <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">No data</div>;
  }

  return (
     <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            barGap={4} // Add gap between bars for the same employee
            barCategoryGap="20%" // Add gap between employee groups
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="employee"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)} // Abbreviate if needed
               height={40} // Adjust height if labels are long or rotated
               interval={0} // Ensure all labels are shown
            />
             <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false} // Keep cursor for better hover feedback on bars
              content={<ChartTooltipContent indicator="dot" />}
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="assigned" fill={chartConfig.assigned.color} radius={4} name="Assigned Leads" />
            <Bar dataKey="prospects" fill={chartConfig.prospects.color} radius={4} name="Prospects" />
            <Bar dataKey="won" fill={chartConfig.won.color} radius={4} name="Won Leads" />
          </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
  )
}

<<<<<<< HEAD
export const EmployeePerformanceChart = React.memo(EmployeePerformanceChartComponent);
=======
>>>>>>> 573bb45a (Initial project push)
