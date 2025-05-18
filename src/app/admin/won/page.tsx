
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { LeadDataTable } from "@/components/leads/lead-data-table";

import type { Lead } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import { fetchWonLeads, updateMockLead } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

// getColumns is handled internally by LeadDataTable
// import { getColumns } from "@/components/leads/lead-table-columns";
import type { Lead } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import { generateMockLeads } from "@/lib/mock-data"; // Import the mock data generator
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

// Use the generated mock leads based on the Excel sheet
const allLeads: Lead[] = generateMockLeads();

// Mock function to fetch leads where outcome is 'Won by GRC'
async function fetchWonLeads(): Promise<Lead[]> {
  console.log("Fetching won leads...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return allLeads.filter(lead => lead.callOutcome === "Won by GRC" || lead.leadStatus === "Booked"); // Also include if leadStatus is Booked
}

// Mock function to update lead (needed for onUpdate prop, though likely no edits happen here)
async function updateWonLeadApi(updatedData: Partial<Lead>): Promise<{ success: boolean; lead?: Lead }> {
  console.log("Attempting to update won lead (likely read-only):", updatedData);
  // Typically, won leads are read-only, but provide a mock response
  await new Promise(resolve => setTimeout(resolve, 300));
  // Find the original lead to return it without changes
   const originalLead = allLeads.find(l => l.id === updatedData.id);
  return { success: false, lead: originalLead }; // Simulate no update allowed, return original
}


export default function WonLeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();


  const userRole = "admin";

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const wonLeadsData = await fetchWonLeads();
      setLeads(wonLeadsData);

  const userRole = "admin"; // This page is for admins

  // Fetch leads on component mount - Use useCallback
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const wonLeads = await fetchWonLeads();
      setLeads(wonLeads);

    } catch (error) {
      console.error("Failed to fetch won leads:", error);
       toast({ variant: "destructive", title: "Error", description: "Could not load won leads data." });
    } finally {
      setIsLoading(false);
    }

  }, [toast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);


  const handleSave = async (updatedData: Partial<Lead>): Promise<{ success: boolean }> => {
    toast({ variant: "destructive", title: "Update Denied", description: "Won leads cannot be modified." });
    return { success: false };
  };

   const handleEditDialog = (lead: Lead) => {
     toast({ variant: "destructive", title: "Action Denied", description: "Won leads cannot be edited." });

  }, [toast]); // Dependency on toast

  React.useEffect(() => {
    loadData();
  }, [loadData]); // Use memoized loadData


  // Handler for saving updates (should ideally not be called for 'Won' leads)
  const handleSave = async (updatedData: Partial<Lead>): Promise<{ success: boolean }> => {
    toast({ variant: "destructive", title: "Update Denied", description: "Won leads cannot be modified." });
    // Optionally call the API which returns success: false
    // const result = await updateWonLeadApi(updatedData);
    return { success: false };
  };

   // Handler for opening edit dialog (should ideally not be called)
   const handleEditDialog = (lead: Lead) => {
     toast({ variant: "destructive", title: "Action Denied", description: "Won leads cannot be edited." });
     // Do not open the dialog

   };


  return (
    <AppLayout userRole={userRole}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">Won by GRC</h1>


         {/* Optionally add export button or summary info */}

      </div>

      {isLoading ? (
           <div className="space-y-4">
              <div className="flex justify-between">
                  <Skeleton className="h-9 w-1/3" />
                  <div className="flex gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                  </div>
              </div>
              <div className="rounded-md border shadow-sm bg-card">

                  <Skeleton className="h-12 w-full rounded-t-md" /> 
                  <div className="space-y-2 p-4"> 

                  <Skeleton className="h-12 w-full rounded-t-md" /> {/* Header */}
                  <div className="space-y-2 p-4"> {/* Rows */}

                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                  </div>
              </div>
               <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-1/4" />
                   <div className="flex gap-2">
                       <Skeleton className="h-9 w-20" />
                       <Skeleton className="h-9 w-20" />
                   </div>
               </div>
          </div>
      ) : (
         <LeadDataTable

          data={leads}
          onEditDialog={handleEditDialog}
          onUpdate={handleSave}
          userRole={userRole}
          viewType="won"
        />
      )}
    </AppLayout>
  );
}

          // Columns are determined internally. Actions like edit/delete will be restricted by userRole.
          data={leads}
          onEditDialog={handleEditDialog} // Pass handler (though it prevents editing)
          onUpdate={handleSave} // Pass handler (though it prevents saving)
          userRole={userRole} // Admin role, but Won leads might have specific restrictions
          viewType="won" // Specify view type
          // No onDelete needed/allowed for won leads
          // No availableEmployees filtering needed typically
          // No row selection needed here usually
        />
      )}

      {/* No Edit Dialog needed for this view as it's typically read-only */}
    </AppLayout>
  );
}
    

