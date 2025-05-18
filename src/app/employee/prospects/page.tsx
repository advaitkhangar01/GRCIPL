
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { LeadDataTable } from "@/components/leads/lead-data-table";
import type { Lead } from "@/types/lead";
import { LeadEditDialog } from "@/components/leads/lead-edit-dialog";
import { useToast } from "@/hooks/use-toast";
import { fetchEmployeeProspectLeads, updateMockLead } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
// getColumns is managed within LeadDataTable
// import { getColumns } from "@/components/leads/lead-table-columns";
import type { Lead } from "@/types/lead";
import { LeadEditDialog } from "@/components/leads/lead-edit-dialog";
import { useToast } from "@/hooks/use-toast";
import { generateMockLeads } from "@/lib/mock-data"; // Import the mock data generator
import { Skeleton } from "@/components/ui/skeleton";
// Use the generated mock leads based on the Excel sheet
const allLeads: Lead[] = generateMockLeads();
// Mock function to fetch leads assigned to the employee that are prospects
async function fetchEmployeeProspectLeads(employeeId: string): Promise<Lead[]> {
  console.log(`Fetching prospect leads for employee: ${employeeId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  // Filter based on assigned employee AND (call outcome being 'Prospect' OR lead status being active)
  return allLeads.filter(lead =>
       lead.assignedTo?.toLowerCase() === employeeId.toLowerCase() &&
       (lead.callOutcome === "Prospect" ||
       ["Hot", "Warm", "Cold", "Very Cold"].includes(lead.leadStatus || ""))
  );
}


// Mock function to update lead (same as employee dashboard)
async function updateLeadApi(updatedData: Partial<Lead>): Promise<{ success: boolean; lead?: Lead }> {
  console.log("Updating lead (employee prospects):", updatedData);
  await new Promise(resolve => setTimeout(resolve, 500));
  // Update the lead in our mock data source
  const leadIndex = allLeads.findIndex(l => l.id === updatedData.id);
  let updatedLead: Lead | undefined;
  if (leadIndex !== -1) {
      allLeads[leadIndex] = { ...allLeads[leadIndex], ...updatedData, lastUpdated: new Date().toISOString() } as Lead;
      updatedLead = allLeads[leadIndex]; // Get the updated lead
       // If leadStatus changes to Lost or Booked, it should disappear from Prospects view on next load
       if (updatedData.leadStatus === 'Lost' || updatedData.leadStatus === 'Booked') {
         console.log(`Lead ${updatedData.id} status changed to ${updatedData.leadStatus}. It will be removed from prospects on refresh.`);
       }
  }
  if (Math.random() > 0.1) {
    return { success: true, lead: updatedLead };
  } else {
    return { success: false };
  }
}



export default function EmployeeProspectsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const [employeeId, setEmployeeId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const userRole = "employee";

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setEmployeeId(storedUserId);
      } else {
        console.error("Employee ID not found in localStorage.");
        toast({ variant: "destructive", title: "Authentication Error", description: "Could not identify user. Please login again." });
        setIsLoading(false); 
      }
    }
  }, [toast]);

  const loadData = React.useCallback(async () => {
    if (!employeeId) {
      setIsLoading(false); 
      return;
    }

  const [employeeId, setEmployeeId] = React.useState<string | null>(null); // State to store employee ID
  const { toast } = useToast();

  const userRole = "employee"; // This page is for employees

   // Effect to get employee ID from localStorage on mount
  React.useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setEmployeeId(storedUserId);
    } else {
      console.error("Employee ID not found in localStorage.");
      toast({ variant: "destructive", title: "Authentication Error", description: "Could not identify user. Please login again." });
      setIsLoading(false); // Stop loading if no ID
    }
  }, [toast]);

  const loadData = React.useCallback(async () => { // Memoize loadData
    if (!employeeId) return; // Don't load if no employeeId yet

      setIsLoading(true);
      try {
        const prospects = await fetchEmployeeProspectLeads(employeeId);
        setLeads(prospects);
      } catch (error) {
        console.error("Failed to fetch employee prospect leads:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load your prospects." });
      } finally {
        setIsLoading(false);
      }

    }, [employeeId, toast]); // fetchEmployeeProspectLeads is stable


    }, [employeeId, toast]); // Dependency on toast and employeeId

  // Fetch leads on component mount or when employeeId changes

  React.useEffect(() => {
    if (employeeId) {
      loadData();
    }

  }, [employeeId, loadData]);


  const handleEditDialog = React.useCallback((lead: Lead) => {
    setEditingLead({...lead});
    setIsEditDialogOpen(true);
  }, []);

  const handleCloseDialog = React.useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingLead(null);
  }, []);

  const handleSave = React.useCallback(async (updatedData: Partial<Lead>): Promise<{success: boolean}> => {
    const result = await updateMockLead(updatedData);
    if (result.success && result.lead) {
        const shouldRemain = result.lead.callOutcome === "Prospect" || ["Hot", "Warm", "Cold", "Very Cold"].includes(result.lead.leadStatus || "");
        if (shouldRemain) {

  }, [employeeId, loadData]); // Use memoized loadData


  // Edit handlers
  const handleEditDialog = (lead: Lead) => {
    setEditingLead({...lead}); // Pass a copy to prevent direct mutation
    setIsEditDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditingLead(null);
  };
  const handleSave = async (updatedData: Partial<Lead>): Promise<{success: boolean}> => {
    const result = await updateLeadApi(updatedData);
    if (result.success && result.lead) {
        // Check if the updated lead should still be in the prospects list
        const shouldRemain = result.lead.callOutcome === "Prospect" || ["Hot", "Warm", "Cold", "Very Cold"].includes(result.lead.leadStatus || "");

        if (shouldRemain) {
            // Update the lead in the current view
            setLeads(prevLeads =>
              prevLeads.map(l => (l.id === result.lead!.id ? result.lead! : l))
            );
        } else {

             setLeads(prevLeads => prevLeads.filter(l => l.id !== result.lead!.id));
             toast({ title: "Lead Updated", description: `Lead "${result.lead.name}" moved from Prospects.` });
        }
        toast({ title: "Lead Updated", description: `Prospect "${result.lead.name}" updated.` });
        return { success: true };
    } else {
       toast({ variant: "destructive", title: "Update Failed", description: result.message || "Could not save changes." });
       return { success: false };
    }
  }, [toast]);

             // Remove the lead from the current view as it's no longer a prospect
             setLeads(prevLeads => prevLeads.filter(l => l.id !== result.lead!.id));
             toast({ title: "Lead Updated", description: `Lead "${result.lead.name}" moved from Prospects.` });
        }
        return { success: true };
    } else {
       // Let the caller (Dialog or DataTable) handle the toast
       return { success: false };
    }
  };



  return (
    <AppLayout userRole={userRole}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">My Prospects ({employeeId || 'Loading...'})</h1>


         {/* No reassign button for employees */}

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
      ) : !employeeId ? (
        <p className="text-destructive text-center mt-10">Could not load prospects. User ID not found or not yet loaded.</p>
      ) : (
         <LeadDataTable
           data={leads}
           onEditDialog={handleEditDialog}
           onUpdate={handleSave}
           userRole={userRole}
           viewType="prospects"
         />
      )}


        <p className="text-destructive text-center mt-10">Could not load prospects. User ID not found.</p>
      ) : (
         <LeadDataTable
          // Columns are determined internally based on userRole and viewType
           data={leads}
           onEditDialog={handleEditDialog}
           onUpdate={handleSave} // Pass the save handler for inline/dialog edits
           userRole={userRole}
           viewType="prospects" // Specify the view type to show relevant columns
           // No onDelete for employees
           // No availableEmployees needed for filtering
           // No row selection needed here usually
         />
      )}

      {/* Edit Dialog */}

      {editingLead && (
        <LeadEditDialog
          lead={editingLead}
          isOpen={isEditDialogOpen}
          onClose={handleCloseDialog}
          userRole={userRole}
           onSave={async (data) => {
               const result = await handleSave(data);
               if (!result.success) {

                  throw new Error("API update failed"); 

                  throw new Error("API update failed"); // Propagate error

               }
           }}
        />
      )}
    </AppLayout>
  );
}
