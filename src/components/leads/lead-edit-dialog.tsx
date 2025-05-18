"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose // Import DialogClose if needed for explicit close button
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeadEditForm } from "./lead-edit-form";
import type { Lead } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";

interface LeadEditDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: "admin" | "employee";
  onSave: (updatedLeadData: Partial<Lead>) => Promise<void>; // Ensure onSave returns Promise<void>
}

export function LeadEditDialog({ lead, isOpen, onClose, userRole, onSave }: LeadEditDialogProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async (data: Partial<Lead>) => {
    if (!lead) return;
    setIsSaving(true);
    try {
      await onSave({ ...data, id: lead.id }); // Call the provided onSave function
      toast({
        title: "Lead Updated",
        description: `Lead "${lead.name}" has been updated successfully.`,
      });
      onClose(); // Close dialog on successful save
    } catch (error) {
       console.error("Failed to save lead:", error);
       toast({
         variant: "destructive",
         title: "Update Failed",
         description: "Could not update lead details. Please try again.",
       });
      // Keep dialog open on error
    } finally {
      setIsSaving(false);
    }
  };


  // Close handler for the dialog primitive
  const handleOpenChange = (open: boolean) => {
    if (!open && !isSaving) { // Only close if not saving
      onClose();
    }
    // If saving, the dialog stays open until save completes or fails
  };

  if (!lead) {
    return null; // Don't render the dialog if no lead is selected
  }

  return (
     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead: {lead.name}</DialogTitle>
          <DialogDescription>
            Modify the lead details below. Fields you can edit depend on your role. Click save when finished.
          </DialogDescription>
        </DialogHeader>

        <LeadEditForm
          lead={lead}
          userRole={userRole}
          onSubmit={handleSave}
          onCancel={onClose} // Pass onClose to the form's cancel button
          isLoading={isSaving}
        />

        {/* Footer can be removed if buttons are handled within the form */}
        {/* <DialogFooter className="mt-4"> */}
          {/* <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button> */}
          {/* Save button is now part of the LeadEditForm */}
        {/* </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
