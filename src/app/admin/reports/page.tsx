"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ReportsPage() {

   const handleExport = (reportType: string) => {
      // Implement report generation and download logic here
     // This would typically involve:
     // 1. Making an API call to the backend (e.g., /api/reports?type=reportType)
     // 2. Backend (PHP) queries the database based on the report type
     // 3. Backend generates the report file (e.g., CSV, Excel)
     // 4. Backend sends the file back to the client for download
     console.log(`Exporting ${reportType} report...`);
     // Placeholder for download simulation
     alert(`Simulating download for ${reportType} report. Implement actual download logic.`);
   };

  return (
    <AppLayout userRole="admin">
       <h1 className="text-2xl font-semibold text-primary mb-6">Reports</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card>
           <CardHeader>
             <CardTitle>Call Summary Report</CardTitle>
             <CardDescription>Download a report summarizing call outcomes and statuses.</CardDescription>
           </CardHeader>
           <CardContent>
             <Button onClick={() => handleExport('call_summary')}>
               <Download className="mr-2 h-4 w-4" /> Download CSV
             </Button>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Employee Performance</CardTitle>
             <CardDescription>Report detailing leads handled and outcomes per employee.</CardDescription>
           </CardHeader>
           <CardContent>
              <Button onClick={() => handleExport('employee_performance')}>
               <Download className="mr-2 h-4 w-4" /> Download CSV
             </Button>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Lead Source Effectiveness</CardTitle>
              <CardDescription>Analyze conversion rates based on lead sources.</CardDescription>
           </CardHeader>
           <CardContent>
             <Button onClick={() => handleExport('source_effectiveness')}>
               <Download className="mr-2 h-4 w-4" /> Download CSV
             </Button>
           </CardContent>
         </Card>

          {/* Add more report cards as needed */}

       </div>
    </AppLayout>
  );
}
