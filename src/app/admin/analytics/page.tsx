<<<<<<< HEAD

=======
>>>>>>> 573bb45a (Initial project push)
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CallOutcomeChart } from "@/components/analytics/call-outcome-chart";
import { EmployeePerformanceChart } from "@/components/analytics/employee-performance-chart";
import { LeadSourceChart } from "@/components/analytics/lead-source-chart";
import { useToast } from "@/hooks/use-toast";
import type { Lead } from "@/types/lead";
import { generateMockLeads } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

// Use the generated mock leads based on the Excel sheet
const allLeads: Lead[] = generateMockLeads();

interface OutcomeCount {
  outcome: string;
  count: number;
}

interface EmployeePerformance {
  employee: string;
  assigned: number;
  prospects: number;
  won: number;
}

interface SourceCount {
  source: string;
  count: number;
}

interface AnalyticsData {
  outcomeCounts: OutcomeCount[];
  employeePerformance: EmployeePerformance[];
  sourceCounts: SourceCount[];
}

// Mock function to simulate fetching aggregated analytics data
async function fetchAnalyticsData(): Promise<AnalyticsData> {
  console.log("Simulating fetch for analytics data...");
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay

  // Calculate Outcome Counts
  const outcomeCountsMap = new Map<string, number>();
  allLeads.forEach(lead => {
    const outcome = lead.callOutcome || "No Outcome"; // Group null/undefined as "No Outcome"
    outcomeCountsMap.set(outcome, (outcomeCountsMap.get(outcome) || 0) + 1);
  });
  const outcomeCounts: OutcomeCount[] = Array.from(outcomeCountsMap, ([outcome, count]) => ({ outcome, count }));

  // Calculate Employee Performance
  const employeePerfMap = new Map<string, { assigned: number; prospects: number; won: number }>();
  // Ensure all potential employees (including Unassigned) are considered
  const employees = [...new Set(allLeads.map(lead => lead.assignedTo || "Unassigned").filter(Boolean) as string[]), "Unassigned"];
  employees.forEach(emp => employeePerfMap.set(emp, { assigned: 0, prospects: 0, won: 0 }));

  allLeads.forEach(lead => {
    const empName = lead.assignedTo || "Unassigned";
    const currentPerf = employeePerfMap.get(empName);
    if (currentPerf) {
      currentPerf.assigned += 1;
      if (lead.callOutcome === 'Prospect') currentPerf.prospects += 1;
      if (lead.callOutcome === 'Won by GRC') currentPerf.won += 1;
<<<<<<< HEAD
    }
  });
  const employeePerformance: EmployeePerformance[] = Array.from(employeePerfMap, ([employee, data]) => ({ employee, ...data }))
    .filter(emp => emp.assigned > 0 || emp.prospects > 0 || emp.won > 0 || (emp.employee === "Unassigned" && allLeads.some(l => !l.assignedTo)));
=======
      // No need to set again, object reference is updated
    }
  });
  const employeePerformance: EmployeePerformance[] = Array.from(employeePerfMap, ([employee, data]) => ({ employee, ...data }))
    .filter(emp => emp.assigned > 0 || emp.prospects > 0 || emp.won > 0 || (emp.employee === "Unassigned" && allLeads.some(l => !l.assignedTo))); // Fix: Use emp.employee
>>>>>>> 573bb45a (Initial project push)

  // Calculate Source Counts
  const sourceCountsMap = new Map<string, number>();
  allLeads.forEach(lead => {
    const source = lead.source || "Unknown"; // Group null/undefined as "Unknown"
    sourceCountsMap.set(source, (sourceCountsMap.get(source) || 0) + 1);
  });
  const sourceCounts: SourceCount[] = Array.from(sourceCountsMap, ([source, count]) => ({ source, count }));

  const finalData = { outcomeCounts, employeePerformance, sourceCounts };
  console.log("Generated Analytics Data:", finalData); // Log the generated data
  return finalData;
}

export default function AnalyticsDashboardPage() {
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

<<<<<<< HEAD
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error on new load attempt
    try {
      const data = await fetchAnalyticsData();
      setAnalyticsData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Failed to load analytics data:", err);
      setError(`Could not load analytics data: ${errorMessage}`);
      toast({ variant: "destructive", title: "Error", description: `Could not load analytics data.` });
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // Dependency on toast remains, fetchAnalyticsData is stable

  React.useEffect(() => {
    loadData();
  }, [loadData]);
=======
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null); // Reset error on new load attempt
      try {
        const data = await fetchAnalyticsData();
        setAnalyticsData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("Failed to load analytics data:", err);
        setError(`Could not load analytics data: ${errorMessage}`);
        toast({ variant: "destructive", title: "Error", description: `Could not load analytics data.` });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [toast]); // Dependency on toast
>>>>>>> 573bb45a (Initial project push)

  const renderContent = () => {
    if (isLoading) {
      return (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <Skeleton className="h-[300px] w-full" />
=======
              <Skeleton className="h-[300px] w-full" /> {/* Increased skeleton height */}
>>>>>>> 573bb45a (Initial project push)
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
               <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
               <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (error) {
      return <p className="text-destructive-foreground bg-destructive p-4 rounded-md">{error}</p>;
    }

    if (!analyticsData || (analyticsData.outcomeCounts.length === 0 && analyticsData.employeePerformance.length === 0 && analyticsData.sourceCounts.length === 0)) {
      return <p className="text-muted-foreground">No analytics data available to display.</p>;
    }

<<<<<<< HEAD
=======
    // Check if data arrays are valid before rendering charts
>>>>>>> 573bb45a (Initial project push)
    const hasOutcomeData = analyticsData.outcomeCounts && analyticsData.outcomeCounts.length > 0;
    const hasEmployeeData = analyticsData.employeePerformance && analyticsData.employeePerformance.length > 0;
    const hasSourceData = analyticsData.sourceCounts && analyticsData.sourceCounts.length > 0;

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hasOutcomeData ? (
          <Card>
            <CardHeader>
              <CardTitle>Call Outcome Distribution</CardTitle>
              <CardDescription>Breakdown of lead outcomes from calls.</CardDescription>
            </CardHeader>
<<<<<<< HEAD
            <CardContent className="pt-4">
=======
            <CardContent className="pt-4"> {/* Added padding top to content */}
>>>>>>> 573bb45a (Initial project push)
              <CallOutcomeChart data={analyticsData.outcomeCounts} />
            </CardContent>
          </Card>
        ) : (
           <Card>
             <CardHeader>
               <CardTitle>Call Outcome Distribution</CardTitle>
               <CardDescription>Breakdown of lead outcomes from calls.</CardDescription>
             </CardHeader>
<<<<<<< HEAD
             <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
=======
             <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground"> {/* Adjusted height */}
>>>>>>> 573bb45a (Initial project push)
                 No outcome data available.
             </CardContent>
            </Card>
        )}

        {hasEmployeeData ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Employee Performance</CardTitle>
              <CardDescription>Lead handling metrics per employee.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeePerformanceChart data={analyticsData.employeePerformance} />
            </CardContent>
          </Card>
        ) : (
             <Card className="lg:col-span-2">
             <CardHeader>
               <CardTitle>Employee Performance</CardTitle>
               <CardDescription>Lead handling metrics per employee.</CardDescription>
             </CardHeader>
             <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                 No employee performance data available.
             </CardContent>
            </Card>
        )}

        {hasSourceData ? (
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Analysis</CardTitle>
              <CardDescription>Count of leads based on their source.</CardDescription>
            </CardHeader>
            <CardContent>
              <LeadSourceChart data={analyticsData.sourceCounts} />
            </CardContent>
          </Card>
        ) : (
             <Card>
             <CardHeader>
               <CardTitle>Lead Source Analysis</CardTitle>
               <CardDescription>Count of leads based on their source.</CardDescription>
             </CardHeader>
             <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
                 No lead source data available.
             </CardContent>
            </Card>
        )}
      </div>
    );
  };

  return (
    <AppLayout userRole="admin">
      <h1 className="text-2xl font-semibold text-primary mb-6">Analytics Dashboard</h1>
      {renderContent()}
    </AppLayout>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 573bb45a (Initial project push)
