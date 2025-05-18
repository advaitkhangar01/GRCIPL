
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { LeadDataTable } from "@/components/leads/lead-data-table";
import type { Lead } from "@/types/lead";
import { LeadEditDialog } from "@/components/leads/lead-edit-dialog";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
import { fetchEmployeeLeads, updateMockLead } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
=======
import { generateMockLeads } from "@/lib/mock-data"; // Import the mock data generator
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

// Use the generated mock leads based on the Excel sheet
const allLeads: Lead[] = generateMockLeads();

// Mock function to fetch leads assigned to the current employee (replace with actual API call)
async function fetchEmployeeLeads(employeeId: string): Promise<Lead[]> {
  console.log(`Fetching leads for employee: ${employeeId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, fetch from your PHP/MySQL backend API
  // Example: const response = await fetch(`/api/leads?assignedTo=${employeeId}`);
  // const data = await response.json(); return data.leads;

  // Return mock data filtered for the employee
  // Match based on the provided employeeId (e.g., "pooja")
  return allLeads.filter(lead => lead.assignedTo?.toLowerCase() === employeeId.toLowerCase());
}

// Mock function to update lead (replace with API call)
// Employees might have a different API endpoint or the backend handles permissions
async function updateLeadApiEmployee(updatedData: Partial<Lead>): Promise<{ success: boolean; lead?: Lead }> {
  console.log("Updating lead (employee):", updatedData);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
  // In real app: fetch call to employee-specific update endpoint or rely on backend validation
  if (Math.random() > 0.1) { // Simulate success
     // Update the lead in our mock data source
     const leadIndex = allLeads.findIndex(l => l.id === updatedData.id);
     if (leadIndex !== -1) {
         allLeads[leadIndex] = { ...allLeads[leadIndex], ...updatedData, lastUpdated: new Date().toISOString() } as Lead;
     }
    return { success: true, lead: allLeads[leadIndex] }; // Simulate returning updated data
  } else {
    return { success: false };
  }
}

>>>>>>> 573bb45a (Initial project push)

export default function EmployeeDashboard() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
<<<<<<< HEAD
  const [employeeId, setEmployeeId] = React.useState<string | null>(null);
=======
  const [employeeId, setEmployeeId] = React.useState<string | null>(null); // State to store employee ID
>>>>>>> 573bb45a (Initial project push)
  const { toast } = useToast();

  const userRole = "employee";

<<<<<<< HEAD
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
=======
  // Effect to get employee ID from localStorage on mount
  React.useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setEmployeeId(storedUserId);
    } else {
      // Handle case where employee ID is not found (e.g., redirect to login)
      console.error("Employee ID not found in localStorage.");
      toast({ variant: "destructive", title: "Authentication Error", description: "Could not identify user. Please login again." });
      // Consider redirecting: router.push('/login');
       setIsLoading(false); // Stop loading if no ID
>>>>>>> 573bb45a (Initial project push)
    }
  }, [toast]);


<<<<<<< HEAD
  const loadLeads = React.useCallback(async () => {
    if (!employeeId) {
      setIsLoading(false); 
      return;
    }
=======
  const loadLeads = React.useCallback(async () => { // Memoize loadLeads
    if (!employeeId) return; // Don't load if no employeeId
>>>>>>> 573bb45a (Initial project push)

    setIsLoading(true);
      try {
        const fetchedLeads = await fetchEmployeeLeads(employeeId);
        setLeads(fetchedLeads);
      } catch (error) {
        console.error("Failed to fetch employee leads:", error);
         toast({ variant: "destructive", title: "Error", description: "Could not load your assigned leads." });
      } finally {
        setIsLoading(false);
      }
<<<<<<< HEAD
  }, [employeeId, toast]); // fetchEmployeeLeads is stable

=======
  }, [employeeId, toast]); // Dependencies

  // Fetch leads when employeeId is set
>>>>>>> 573bb45a (Initial project push)
  React.useEffect(() => {
    if (employeeId) {
      loadLeads();
    }
  }, [employeeId, loadLeads]);


<<<<<<< HEAD
  const handleEditDialog = React.useCallback((lead: Lead) => {
    setEditingLead(lead);
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
       toast({ title: "Lead Updated", description: `Lead "${result.lead.name}" updated.` });
       return { success: true };
     } else {
       toast({ variant: "destructive", title: "Update Failed", description: result.message || "Could not save changes." });
       return { success: false };
     }
  }, [toast]);

  return (
    <AppLayout userRole={userRole}>
       <div className="flex justify-between items-center mb-4 sm:mb-6">
         <h1 className="text-xl sm:text-2xl font-semibold text-primary">My Assigned Leads ({employeeId || 'Loading...'})</h1>
       </div>

      {isLoading ? (
=======
  // Handler to open the edit dialog
  const handleEditDialog = (lead: Lead) => {
    setEditingLead(lead);
    setIsEditDialogOpen(true);
  };

    // Handler to close the edit dialog
  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditingLead(null); // Clear the editing lead state
  };

  // Handler for saving updated lead data (used by both Dialog and Inline Edit)
  const handleSave = async (updatedData: Partial<Lead>): Promise<{ success: boolean }> => {
     const result = await updateLeadApiEmployee(updatedData);
     if (result.success && result.lead) {
       setLeads(prevLeads =>
         prevLeads.map(l => (l.id === result.lead!.id ? result.lead! : l)) // Use result.lead
       );
       // await loadLeads(); // No need to refetch if local update is sufficient
       return { success: true };
     } else {
       return { success: false }; // Let caller handle toast
     }
  };

  return (
    <AppLayout userRole={userRole}>
       <div className="flex justify-between items-center mb-4 sm:mb-6"> {/* Adjusted margin */}
         <h1 className="text-xl sm:text-2xl font-semibold text-primary">My Assigned Leads ({employeeId || 'Loading...'})</h1> {/* Adjusted size */}
         {/* Add any employee-specific buttons or info here if needed */}
       </div>

      {isLoading ? (
          // Skeleton Loader for Table (similar to admin)
>>>>>>> 573bb45a (Initial project push)
          <div className="space-y-4">
               <div className="flex justify-between">
                  <Skeleton className="h-9 w-1/3" />
                  <div className="flex gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                  </div>
              </div>
              <div className="rounded-md border shadow-sm bg-card">
<<<<<<< HEAD
                  <Skeleton className="h-12 w-full rounded-t-md" />
                  <div className="space-y-2 p-4">
=======
                  <Skeleton className="h-12 w-full rounded-t-md" /> {/* Header */}
                  <div className="space-y-2 p-4"> {/* Rows */}
>>>>>>> 573bb45a (Initial project push)
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
<<<<<<< HEAD
        <p className="text-destructive text-center mt-10">Could not load leads. User ID not found or not yet loaded.</p>
      ): (
        <LeadDataTable
          data={leads}
          onEditDialog={handleEditDialog}
          onUpdate={handleSave}
          userRole={userRole}
          viewType="all"
        />
      )}

=======
        <p className="text-destructive text-center mt-10">Could not load leads. User ID not found.</p> // Centered message
      ): (
        <LeadDataTable
          // Columns are determined internally
          data={leads}
          onEditDialog={handleEditDialog}
          onUpdate={handleSave} // Pass the save handler
          userRole={userRole}
          viewType="all" // Explicitly set viewType for employee dashboard
          // No onDelete passed for employee
          // No availableEmployees needed for filtering
        />
      )}

       {/* Edit Dialog */}
>>>>>>> 573bb45a (Initial project push)
       {editingLead && (
          <LeadEditDialog
            lead={editingLead}
            isOpen={isEditDialogOpen}
            onClose={handleCloseDialog}
            userRole={userRole}
            onSave={async (data) => {
                const result = await handleSave(data);
                 if (!result.success) {
<<<<<<< HEAD
                     throw new Error("API update failed"); 
=======
                     throw new Error("API update failed"); // Propagate error to keep dialog open
>>>>>>> 573bb45a (Initial project push)
                 }
            }}
          />
        )}
    </AppLayout>
  );
}
<<<<<<< HEAD
=======
    
>>>>>>> 573bb45a (Initial project push)
