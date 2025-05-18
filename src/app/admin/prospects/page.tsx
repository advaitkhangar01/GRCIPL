
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { LeadDataTable } from "@/components/leads/lead-data-table";
// getColumns is managed within LeadDataTable
// import { getColumns } from "@/components/leads/lead-table-columns";

import type { Lead } from "@/types/lead";
import { LeadEditDialog } from "@/components/leads/lead-edit-dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";


import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { fetchProspectLeads, fetchEmployees, updateMockLead, assignMockLeads, deleteMockLead } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";


import { generateMockLeads } from "@/lib/mock-data"; // Import the mock data generator
import { Skeleton } from "@/components/ui/skeleton";

// Use the generated mock leads based on the Excel sheet
const allLeads: Lead[] = generateMockLeads();


// Mock function to fetch leads where outcome is 'Prospect'
async function fetchProspectLeads(): Promise<Lead[]> {
  console.log("Fetching prospect leads...");
  await new Promise(resolve => setTimeout(resolve, 500));
  // Filter based on call outcome being 'Prospect' OR lead status being active (Hot, Warm, Cold, Very Cold)
  return allLeads.filter(lead =>
       lead.callOutcome === "Prospect" ||
       ["Hot", "Warm", "Cold", "Very Cold"].includes(lead.leadStatus || "")
  );
}

// Mock function to reassign leads
async function reassignLeadsApi(leadIds: (number | string)[], employeeId: string): Promise<{ success: boolean }> {
  console.log(`Reassigning prospect leads ${leadIds.join(', ')} to ${employeeId}`);
  await new Promise(resolve => setTimeout(resolve, 700));
  // In a real app, update the assignedTo field in the database for these lead IDs
  // Update mock data
  leadIds.forEach(id => {
      const leadIndex = allLeads.findIndex(l => l.id === id);
      if(leadIndex !== -1) {
          allLeads[leadIndex].assignedTo = employeeId;
          allLeads[leadIndex].lastUpdated = new Date().toISOString();
      }
  });
  return { success: true };
}

// Mock function to fetch employees
async function fetchEmployees(): Promise<string[]> {
   console.log("Fetching employees...");
   await new Promise(resolve => setTimeout(resolve, 300));
    // Extract unique employee names from the full dataset
    const employees = [...new Set(allLeads.map(lead => lead.assignedTo).filter(Boolean) as string[])];
    return employees; // Return actual employees from data
}


// Mock function to update lead (same as admin dashboard for consistency)
async function updateLeadApi(updatedData: Partial<Lead>): Promise<{ success: boolean; lead?: Lead }> {
  console.log("Updating lead:", updatedData);
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


export default function ProspectsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);


  // Use table's internal row selection state

  const [tableRowSelection, setTableRowSelection] = React.useState({});
  const [selectedLeadIds, setSelectedLeadIds] = React.useState<(number | string)[]>([]);
  const [employees, setEmployees] = React.useState<string[]>([]);
  const [targetEmployee, setTargetEmployee] = React.useState<string>('');
  const [isReassigning, setIsReassigning] = React.useState(false);
  const { toast } = useToast();


  const userRole = "admin";

  const loadData = React.useCallback(async () => {
      setIsLoading(true);
      setTableRowSelection({});

  const userRole = "admin"; // This page is for admins

  const loadData = React.useCallback(async () => { // Memoize loadData
      setIsLoading(true);
      setTableRowSelection({}); // Reset selection on load

      setSelectedLeadIds([]);
      try {
        const [prospects, employeeList] = await Promise.all([
           fetchProspectLeads(),
           fetchEmployees()
        ]);
        setLeads(prospects);
         setEmployees(employeeList);
      } catch (error) {
        console.error("Failed to fetch prospect leads or employees:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load data." });
      } finally {
        setIsLoading(false);
      }

    }, [toast]); // fetchProspectLeads and fetchEmployees are stable

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
      const selectedIds = Object.keys(tableRowSelection).map(indexStr => {
          const index = parseInt(indexStr, 10);
          return leads[index]?.id;
      }).filter(id => id !== undefined) as (number | string)[];

    }, [toast]); // Dependency on toast

  // Fetch leads and employees on component mount
  React.useEffect(() => {
    loadData();
  }, [loadData]); // Use memoized loadData

  // Effect to update selectedLeadIds when table selection changes
  React.useEffect(() => {
      const selectedIds = Object.keys(tableRowSelection).map(indexStr => {
          const index = parseInt(indexStr, 10);
          return leads[index]?.id; // Get the ID from the leads array using the index
      }).filter(id => id !== undefined) as (number | string)[]; // Filter out undefined IDs

      setSelectedLeadIds(selectedIds);
  }, [tableRowSelection, leads]);



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

   const handleReassign = React.useCallback(async () => {

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

   // Reassign handler
   const handleReassign = async () => {

     if (selectedLeadIds.length === 0 || !targetEmployee) {
       toast({ variant: "destructive", title: "Reassignment Error", description: "Please select leads and a target employee." });
       return;
     }
     setIsReassigning(true);
     try {

       const result = await assignMockLeads(selectedLeadIds, targetEmployee); // Use assignMockLeads
       if (result.success) {
         toast({ title: "Reassignment Successful", description: `${selectedLeadIds.length} prospects reassigned to ${targetEmployee}.` });
         await loadData(); // Re-fetch data
         setTargetEmployee('');

       const result = await reassignLeadsApi(selectedLeadIds, targetEmployee);
       if (result.success) {
         toast({ title: "Reassignment Successful", description: `${selectedLeadIds.length} prospects reassigned to ${targetEmployee}.` });
         // Refresh the prospects list after reassignment
         await loadData(); // Reload data to reflect changes
         setTargetEmployee(''); // Clear target employee

       } else {
          toast({ variant: "destructive", title: "Reassignment Failed", description: "Could not reassign leads." });
       }
     } catch (error) {
       console.error("Reassignment error:", error);
       toast({ variant: "destructive", title: "Reassignment Error", description: "An unexpected error occurred." });
     } finally {
       setIsReassigning(false);
     }

   }, [selectedLeadIds, targetEmployee, toast, loadData]); // Added loadData to dependencies
   
   const handleDelete = React.useCallback(async (leadId: string | number) => {
        const result = await deleteMockLead(leadId);
        if (result.success) {
            setLeads(prevLeads => prevLeads.filter(l => l.id !== leadId));
            toast({ title: "Lead Deleted", description: `Lead ID ${leadId} has been removed from prospects.` });
        } else {
            toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete lead from prospects." });
        }
   }, [toast]);

   };

  // Log selected IDs for debugging
   React.useEffect(() => {
     console.log("Selected Lead IDs:", selectedLeadIds);
   }, [selectedLeadIds]);



  return (
    <AppLayout userRole={userRole}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">Prospects</h1>


         {/* Reassign Action Area */}

         <AlertDialog>
           <AlertDialogTrigger asChild>
             <Button size="sm" disabled={isLoading || selectedLeadIds.length === 0 || isReassigning}>
               <UserPlus className="mr-2 h-4 w-4" /> Reassign Selected ({selectedLeadIds.length})
             </Button>
           </AlertDialogTrigger>
           <AlertDialogContent>
             <AlertDialogHeader>
               <AlertDialogTitle>Reassign Prospects</AlertDialogTitle>
               <AlertDialogDescription>
                 Select an employee to assign the selected {selectedLeadIds.length} prospect(s) to.
                 This action will update the 'Assigned To' field for these leads.
               </AlertDialogDescription>
             </AlertDialogHeader>
              <div className="py-4">
               <Select value={targetEmployee} onValueChange={setTargetEmployee} disabled={isReassigning}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee to Assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <AlertDialogFooter>
               <AlertDialogCancel disabled={isReassigning}>Cancel</AlertDialogCancel>
               <AlertDialogAction onClick={handleReassign} disabled={isReassigning || !targetEmployee}>
                 {isReassigning ? "Reassigning..." : "Confirm Reassignment"}
               </AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>
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
           onDelete={handleDelete} // Pass delete handler for prospects
           userRole={userRole}
           availableEmployees={employees}
           rowSelection={tableRowSelection}
           onRowSelectionChange={setTableRowSelection}
           viewType="prospects"
         />
      )}


          // Columns are determined internally based on userRole and inline edit state
           data={leads}
           onEditDialog={handleEditDialog}
           onUpdate={handleSave} // Pass the save handler for inline/dialog edits
           onDelete={async (leadId) => { // Add delete handler here as well for consistency
                console.log(`Attempting to delete prospect lead ${leadId}`);
                // Confirmation dialog is handled within the DataTable column definition
                // const result = await deleteLeadApi(leadId); // Use a generic delete API if applicable
                // For now, just simulate success and remove locally
                 setLeads(prevLeads => prevLeads.filter(l => l.id !== leadId));
                 toast({ title: "Lead Deleted", description: `Lead ID ${leadId} has been removed.` });
            }}
           userRole={userRole}
           availableEmployees={employees} // Pass employees for filtering
           // Pass row selection state and handler
           rowSelection={tableRowSelection} // Pass selection state
           onRowSelectionChange={setTableRowSelection} // Pass handler for selection changes
           viewType="prospects" // Specify view type
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


    

