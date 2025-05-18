
"use client"

import * as React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Leads",
  },
  // Define all expected outcomes from your types/mock-data here
  Prospect: { label: "Prospect", color: "hsl(var(--chart-1))" },
  "Call Back": { label: "Call Back", color: "hsl(var(--chart-2))" },
  "Not Interested": { label: "Not Interested", color: "hsl(var(--chart-5))" },
  Ringing: { label: "Ringing", color: "hsl(var(--chart-3))" },
  "Call Disconnected": { label: "Disconnected", color: "hsl(var(--chart-4))" },
  "Won by GRC": { label: "Won", color: "hsl(var(--chart-1))" }, // Consider a distinct success color if preferred
  "No Outcome": { label: "No Outcome", color: "hsl(var(--muted))" },
  // Add any other outcomes that might appear
  "Connected": { label: "Connected", color: "hsl(var(--chart-1))" }, // Example if "Connected" itself is an outcome sometimes
  "Not Connected": { label: "Not Connected", color: "hsl(var(--chart-4))" }, // Example
} satisfies ChartConfig

interface CallOutcomeChartProps {
   data: { outcome: string; count: number }[];
}

// Define a type that represents the valid keys of chartConfig
type ValidChartOutcome = keyof typeof chartConfig;

<<<<<<< HEAD
const CallOutcomeChartComponent = ({ data }: CallOutcomeChartProps) => {
=======
export function CallOutcomeChart({ data }: CallOutcomeChartProps) {
>>>>>>> 573bb45a (Initial project push)
   const chartData = React.useMemo(() => {
     return data.map(item => {
       const outcomeKey = item.outcome as ValidChartOutcome;
       // Check if the outcomeKey exists in chartConfig, otherwise use a fallback
       const isValidKey = Object.prototype.hasOwnProperty.call(chartConfig, outcomeKey);
       const color = isValidKey ? chartConfig[outcomeKey]?.color : "hsl(var(--muted))"; // Fallback color
       const label = isValidKey ? chartConfig[outcomeKey]?.label : item.outcome; // Fallback label

       return {
         ...item,
         name: label, // Use 'name' key for legend and tooltip by default in recharts
         fill: color,
       };
     });
   }, [data]);

   const totalCount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0)
   }, [data]);

   if (!chartData || chartData.length === 0) {
     return <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">No data</div>;
   }

  return (
    // Ensure ChartContainer wraps both the chart and the legend
     <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />} // Use nameKey from data by default
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name" // Use the 'name' field which has the formatted label
            innerRadius={50} // Slightly smaller inner radius for donut
            outerRadius={90} // Larger outer radius
            strokeWidth={1}
            cx="50%" // Center horizontally
            cy="45%" // Move slightly up to make space for legend below
            labelLine={false}
            label={({ percent, midAngle, outerRadius, cx, cy }) => {
               const RADIAN = Math.PI / 180;
               // Calculate position just outside the slice
               const radius = outerRadius + 15; // Adjust distance from outer edge
               const x = cx + radius * Math.cos(-midAngle * RADIAN);
               const y = cy + radius * Math.sin(-midAngle * RADIAN);
               const percentage = (percent * 100).toFixed(0);

               // Hide labels for very small slices to avoid clutter
               if (percent < 0.03) return null;

               return (
                 <text
                   x={x}
                   y={y}
                   fill="hsl(var(--foreground))"
                   textAnchor={x > cx ? 'start' : 'end'} // Adjust anchor based on position
                   dominantBaseline="central"
                   fontSize={11} // Slightly smaller font size
                   fontWeight={500} // Medium weight
                 >
                   {`${percentage}%`}
                 </text>
               );
             }}
          >
             {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                className="focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1"
                aria-label={`${entry.name}: ${entry.count}`}
              />
            ))}
          </Pie>
           {/* Place ChartLegend *inside* PieChart and ResponsiveContainer */}
           <ChartLegend
                content={<ChartLegendContent nameKey="name" className="flex flex-wrap justify-center gap-x-4 gap-y-1 !text-xs mt-2"/>} // Adjusted classes and margin
                wrapperStyle={{ paddingTop: '0px', marginTop: 'auto' }} // Position legend at bottom
                verticalAlign="bottom"
                align="center"
                layout="horizontal" // Ensure horizontal layout
           />
        </PieChart>
       </ResponsiveContainer>
     </ChartContainer>
  )
}
<<<<<<< HEAD

export const CallOutcomeChart = React.memo(CallOutcomeChartComponent);
=======
>>>>>>> 573bb45a (Initial project push)
