
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useState, useEffect, useCallback } from "react";
import type { Lead } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import { fetchUnassignedLeads, fetchEmployees, assignMockLeads } from "@/lib/mock-data";
=======
import { useState, useEffect, useCallback } from "react"; // Import useCallback
import type { Lead } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import { generateMockLeads } from "@/lib/mock-data"; // Import the mock data generator

// Use the generated mock leads based on the Excel sheet
const allLeads: Lead[] = generateMockLeads();

// Mock functions (replace with actual API calls)
async function fetchUnassignedLeads(): Promise<Lead[]> {
  console.log("Fetching unassigned leads...");
  await new Promise(resolve => setTimeout(resolve, 500));
  // Filter mock data for unassigned leads (null, undefined, or "Unassigned")
  return allLeads.filter(lead => !lead.assignedTo || lead.assignedTo === "Unassigned");
}

async function fetchEmployees(): Promise<string[]> {
   console.log("Fetching employees...");
   await new Promise(resolve => setTimeout(resolve, 300));
    // Extract unique employee names from the full dataset
    const employees = [...new Set(allLeads.map(lead => lead.assignedTo).filter(Boolean) as string[])];
   return employees; // Return actual employees from data
}

async function assignLeadsApi(leadIds: (number | string)[], employeeId: string): Promise<{ success: boolean }> {
  console.log(`Assigning leads ${leadIds.join(', ')} to ${employeeId}`);
   await new Promise(resolve => setTimeout(resolve, 700));
   // Simulate API call and update mock data
   leadIds.forEach(id => {
       const leadIndex = allLeads.findIndex(l => l.id === id);
       if(leadIndex !== -1) {
           allLeads[leadIndex].assignedTo = employeeId;
           allLeads[leadIndex].lastUpdated = new Date().toISOString();
       }
   });
   return { success: true };
}



export default function AssignLeadsPage() {
  const [unassignedLeads, setUnassignedLeads] = useState<Lead[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<(number | string)[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();



  // Memoize loadData to prevent re-creation on every render

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leadsData, employeesData] = await Promise.all([
        fetchUnassignedLeads(),
        fetchEmployees()
      ]);
      setUnassignedLeads(leadsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Failed to load data for assignment:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load data." });
    } finally {
      setIsLoading(false);
    }

  }, [toast]); // fetchUnassignedLeads and fetchEmployees are stable

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckboxChange = useCallback((leadId: number | string, checked: boolean | string) => {
     setSelectedLeads(prev =>
       checked ? [...prev, leadId] : prev.filter(id => id !== leadId)
     );
  }, []);

   const handleSelectAll = useCallback((checked: boolean | string) => {

  }, [toast]); // Add toast as dependency

  useEffect(() => {
    loadData();
  }, [loadData]); // Use memoized loadData

  const handleCheckboxChange = (leadId: number | string, checked: boolean | string) => {
     setSelectedLeads(prev =>
       checked ? [...prev, leadId] : prev.filter(id => id !== leadId)
     );
  };

   const handleSelectAll = (checked: boolean | string) => {

     if (checked) {
       setSelectedLeads(unassignedLeads.map(lead => lead.id));
     } else {
       setSelectedLeads([]);
     }

   }, [unassignedLeads]);

   const handleAssign = useCallback(async () => {

   };

   const handleAssign = async () => {

     if (selectedLeads.length === 0 || !selectedEmployee) {
       toast({ variant: "destructive", title: "Assignment Error", description: "Please select at least one lead and an employee." });
       return;
     }
      setIsLoading(true);
     try {

       const result = await assignMockLeads(selectedLeads, selectedEmployee);
       if (result.success) {
         toast({ title: "Assignment Successful", description: `${selectedLeads.length} leads assigned to ${selectedEmployee}.` });
         await loadData(); // Re-fetch data
         setSelectedLeads([]);
         setSelectedEmployee('');

       const result = await assignLeadsApi(selectedLeads, selectedEmployee);
       if (result.success) {
         toast({ title: "Assignment Successful", description: `${selectedLeads.length} leads assigned to ${selectedEmployee}.` });
         // Refresh unassigned leads list by calling loadData again
         await loadData(); // Reload data
         setSelectedLeads([]); // Clear selection
         setSelectedEmployee(''); // Clear employee selection

       } else {
          toast({ variant: "destructive", title: "Assignment Failed", description: "Could not assign leads. Please try again." });
       }
     } catch (error) {
        console.error("Assignment error:", error);
        toast({ variant: "destructive", title: "Assignment Error", description: "An unexpected error occurred." });
     } finally {
       setIsLoading(false);
     }

   }, [selectedLeads, selectedEmployee, toast, loadData]); // Added loadData as dependency
   };



  return (
    <AppLayout userRole="admin">
       <h1 className="text-2xl font-semibold text-primary mb-6">Assign Leads</h1>
        <Card>
         <CardHeader>
            <CardTitle>Unassigned Leads</CardTitle>
            <CardDescription>Select leads and assign them to an employee.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {isLoading ? (
             <p>Loading...</p>
           ) : unassignedLeads.length === 0 ? (
              <p className="text-muted-foreground">No unassigned leads found.</p>
           ) : (
             <div className="space-y-4">
               <div className="flex items-center space-x-2 border-b pb-2">
                  <Checkbox
                    id="select-all"
                     checked={selectedLeads.length === unassignedLeads.length && unassignedLeads.length > 0}
                     onCheckedChange={handleSelectAll}
                     aria-label="Select all unassigned leads"
                  />
                  <Label htmlFor="select-all" className="font-medium">Select All</Label>
               </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                 {unassignedLeads.map(lead => (
                   <div key={lead.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50">
                      <Checkbox
                       id={`lead-${lead.id}`}
                       checked={selectedLeads.includes(lead.id)}
                       onCheckedChange={(checked) => handleCheckboxChange(lead.id, checked)}
                       aria-labelledby={`lead-label-${lead.id}`}
                      />
                      <Label htmlFor={`lead-${lead.id}`} id={`lead-label-${lead.id}`} className="flex-1 cursor-pointer">
                        <span className="font-medium">{lead.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({lead.phone})</span>
                      </Label>
                   </div>
                 ))}
               </div>
             </div>
           )}

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t">
             <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={isLoading}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAssign}
                disabled={isLoading || selectedLeads.length === 0 || !selectedEmployee}
                className="w-full sm:w-auto"
              >
                Assign Selected ({selectedLeads.length})
              </Button>
           </div>
         </CardContent>
       </Card>
    </AppLayout>
  );
}

 


