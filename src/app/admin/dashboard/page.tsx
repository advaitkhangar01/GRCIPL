
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { LeadDataTable } from "@/components/leads/lead-data-table";

import type { Lead } from "@/types/lead";
import { LeadEditDialog } from "@/components/leads/lead-edit-dialog";
import { Button } from "@/components/ui/button";
import { Upload, Users, History } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { fetchAdminLeads, updateMockLead, deleteMockLead, fetchEmployees as fetchAllEmployees } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

// getColumns is now handled within LeadDataTable based on inline edit state
// import { getColumns } from "@/components/leads/lead-table-columns";
import type { Lead } from "@/types/lead";
import { LeadEditDialog } from "@/components/leads/lead-edit-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Users, History } from "lucide-react"; // Added History import
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
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
import { generateMockLeads } from "@/lib/mock-data"; // Import the mock data generator
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

// Use the generated mock leads based on the Excel sheet
const allLeads: Lead[] = generateMockLeads();

// Mock data fetching function (replace with actual API call)
async function fetchAdminLeads(): Promise<Lead[]> {
  console.log("Fetching admin leads...");
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, fetch from your PHP/MySQL backend API
  // Example: const response = await fetch('/api/leads?role=admin');
  // const data = await response.json(); return data.leads;

  // Return mock data for now
  return [...allLeads]; // Return a copy to avoid direct mutation issues
}

// Mock function to update lead (replace with API call) - Used by both Dialog and Inline Edit
async function updateLeadApi(updatedData: Partial<Lead>): Promise<{ success: boolean; lead?: Lead }> {
  console.log("Updating lead:", updatedData);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
  // In real app: const response = await fetch(`/api/leads/${updatedData.id}`, { method: 'PUT', body: JSON.stringify(updatedData) });
  // Check response.ok
  if (Math.random() > 0.1) { // Simulate success most of the time
     // Update the lead in our mock data source
     const leadIndex = allLeads.findIndex(l => l.id === updatedData.id);
     let updatedLead: Lead | undefined = undefined;
     if (leadIndex !== -1) {
         allLeads[leadIndex] = { ...allLeads[leadIndex], ...updatedData, lastUpdated: new Date().toISOString() } as Lead;
          updatedLead = allLeads[leadIndex];
     }
    return { success: true, lead: updatedLead }; // Return the updated lead data
  } else {
    return { success: false };
  }
}

// Mock function to delete lead (replace with API call)
async function deleteLeadApi(leadId: number | string): Promise<{ success: boolean }> {
  console.log("Deleting lead:", leadId);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
  // In real app: const response = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
  // Check response.ok
  const leadIndex = allLeads.findIndex(l => l.id === leadId);
  if (leadIndex !== -1) {
      allLeads.splice(leadIndex, 1); // Remove from mock array
  }
  return { success: true }; // Assume success for demo
}


export default function AdminDashboard() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const [availableEmployees, setAvailableEmployees] = React.useState<string[]>([]);
  const { toast } = useToast();

  const userRole = "admin";

  const loadLeadsAndEmployees = React.useCallback(async () => {
      setIsLoading(true);
      try {
        const [fetchedLeads, fetchedEmployees] = await Promise.all([
          fetchAdminLeads(),
          fetchAllEmployees()
        ]);
        setLeads(fetchedLeads);
        const employeesWithUnassigned = [...new Set(fetchedEmployees), "Unassigned"];
        setAvailableEmployees(employeesWithUnassigned);
      } catch (error) {
        console.error("Failed to fetch leads or employees:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load data." });
      } finally {
        setIsLoading(false);
      }
    }, [toast]); // fetchAllEmployees is stable, fetchAdminLeads is stable

  React.useEffect(() => {
    loadLeadsAndEmployees();
  }, [loadLeadsAndEmployees]);


  const handleEditDialog = React.useCallback((lead: Lead) => {
    setEditingLead({...lead});
    setIsEditDialogOpen(true);
  }, []);

  const handleCloseDialog = React.useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingLead(null);
  }, []);

  const handleSave = React.useCallback(async (updatedData: Partial<Lead>): Promise<{ success: boolean }> => {
    const result = await updateMockLead(updatedData);
    if (result.success && result.lead) {
      setLeads(prevLeads =>
         prevLeads.map(l => (l.id === result.lead!.id ? result.lead! : l))
      );
       if (updatedData.assignedTo !== undefined) { // Refresh employee list if assignment changed
         const updatedEmployeeList = await fetchAllEmployees();
         setAvailableEmployees([...new Set(updatedEmployeeList), "Unassigned"]);
       }
       toast({ title: "Lead Updated", description: `Lead "${result.lead.name}" updated successfully.` });
       return { success: true };
    } else {
       toast({ variant: "destructive", title: "Update Failed", description: result.message || "Could not save changes." });
       return { success: false };
    }
  }, [toast]); // fetchAllEmployees is stable

  const handleDelete = React.useCallback(async (leadId: number | string) => {
    const result = await deleteMockLead(leadId);
    if (result.success) {
      setLeads(prevLeads => prevLeads.filter(l => l.id !== leadId));

  const [availableEmployees, setAvailableEmployees] = React.useState<string[]>([]); // State for employee list
  const { toast } = useToast();

  const userRole = "admin"; // Set user role for this page

  const loadLeads = React.useCallback(async () => { // Memoize loadLeads
      setIsLoading(true);
      try {
        const fetchedLeads = await fetchAdminLeads();
        setLeads(fetchedLeads);
         // Extract unique employee names for filtering (remove duplicates and null/undefined/empty strings)
         // Get employees from the currently loaded leads (allLeads might change)
         const employees = [...new Set(fetchedLeads.map(lead => lead.assignedTo).filter(Boolean) as string[]), "Unassigned"];
        setAvailableEmployees(employees);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load lead data." });
      } finally {
        setIsLoading(false);
      }
    }, [toast]); // Dependency on toast

  // Fetch leads on component mount
  React.useEffect(() => {
    loadLeads();
  }, [loadLeads]); // Depend on memoized loadLeads


  // Handler to open the edit dialog
  const handleEditDialog = (lead: Lead) => {
    setEditingLead({...lead}); // Pass a copy to prevent direct mutation in dialog
    setIsEditDialogOpen(true);
  };

  // Handler to close the edit dialog
  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditingLead(null); // Clear the editing lead state
  };

  // Handler for saving updated lead data from Dialog or Inline Edit
  const handleSave = async (updatedData: Partial<Lead>): Promise<{ success: boolean }> => {
    const result = await updateLeadApi(updatedData);
    if (result.success && result.lead) {
      // Update the leads state locally using the returned lead data
      setLeads(prevLeads =>
         prevLeads.map(l => (l.id === result.lead!.id ? result.lead! : l)) // Use result.lead
      );
       // Update available employees if assignment changed
       if (updatedData.assignedTo !== undefined) {
         const employees = [...new Set(allLeads.map(lead => lead.assignedTo).filter(Boolean) as string[]), "Unassigned"];
         setAvailableEmployees(employees);
       }
       return { success: true };
    } else {
       // Let the calling component (Dialog or DataTable) handle the error toast
       return { success: false };
    }
  };

   // Handler for deleting a lead
  const handleDelete = async (leadId: number | string) => {
    console.log(`Attempting to delete lead ${leadId}`);
    // Confirmation dialog is handled within the DataTable column definition
    const result = await deleteLeadApi(leadId);
    if (result.success) {
      setLeads(prevLeads => prevLeads.filter(l => l.id !== leadId)); // Update local state

      toast({ title: "Lead Deleted", description: `Lead ID ${leadId} has been removed.` });
    } else {
      toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete lead." });
    }

  }, [toast]);

  return (
    <AppLayout userRole={userRole}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
         <h1 className="text-xl sm:text-2xl font-semibold text-primary">Admin Dashboard - All Leads</h1>
          <div className="flex flex-wrap gap-2 self-start sm:self-center">

  };

  return (
    <AppLayout userRole={userRole}>
       {/* Adjusted header layout for responsiveness */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
         <h1 className="text-xl sm:text-2xl font-semibold text-primary">Admin Dashboard - All Leads</h1>
          <div className="flex flex-wrap gap-2 self-start sm:self-center"> {/* Align buttons to start on small screens */}
             {/* Add links/buttons for Admin actions */}

            <Link href="/admin/upload" passHref>
               <Button variant="default" size="sm"><Upload className="mr-2 h-4 w-4" /> Upload</Button>
            </Link>
             <Link href="/admin/assign" passHref>
               <Button variant="default" size="sm"><Users className="mr-2 h-4 w-4" /> Assign</Button>
             </Link>
             <Link href="/admin/upload-history" passHref>
                <Button variant="default" size="sm"><History className="mr-2 h-4 w-4" /> History</Button>
             </Link>
          </div>
       </div>

      {isLoading ? (


          // Skeleton Loader for Table

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
          onDelete={handleDelete}
          onUpdate={handleSave}
          userRole={userRole}
          availableEmployees={availableEmployees}
          viewType="all"
        />
      )}


          // Columns are now determined internally by LeadDataTable based on inline edit state
          data={leads}
          onEditDialog={handleEditDialog} // Pass the dialog edit handler
          onDelete={handleDelete} // Pass delete handler
          onUpdate={handleSave} // Pass the unified update handler
          userRole={userRole}
          availableEmployees={availableEmployees}
          viewType="all" // Explicitly set viewType for the main dashboard
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
                 }
            }}
          />
        )}
    </AppLayout>
  );
}

            // Use a wrapper for onSave to match expected signature if needed, or adjust LeadEditDialog
            onSave={async (data) => {
                 const result = await handleSave(data);
                 if (!result.success) {
                     throw new Error("API update failed"); // Propagate error to keep dialog open
                 }
                 // Success is handled by closing the dialog via onClose in LeadEditDialog
            }}
          />
        )}

    </AppLayout>
  );
}
    
