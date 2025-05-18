
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Lead, CallStatus, CallOutcome, LeadStatus, LeadResult } from "@/types/lead"; // Import new types
import { callStatuses, callOutcomes, leadStatuses, leadResults } from './lead-table-columns'; // Import options
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface LeadEditFormProps {
  lead: Lead;
  userRole: "admin" | "employee";
  onSubmit: (data: Partial<Lead>) => Promise<void>; // Make onSubmit async
  onCancel: () => void;
  isLoading: boolean;
}

// Define Zod schema based on Lead type, making fields optional for partial updates
// We make most fields optional because we only submit changed fields.
// Required fields like `id` are handled separately.
const formSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")).or(z.null()), // Allow empty string and null
  phone: z.string().optional(),
  source: z.string().optional(),
  assignedTo: z.string().optional().or(z.null()), // Allow null for unassigned
  location: z.string().optional().or(z.null()),
  remark: z.string().optional().or(z.null()),
  callDate: z.date().optional().nullable(),
  callBookedLost: z.enum(["Booked", "Lost"]).optional().nullable(),
  callStatus: z.enum(callStatuses.filter(s => s !== null) as [CallStatus, ...CallStatus[]]).optional().nullable(),
  callOutcome: z.enum(callOutcomes.filter(o => o !== null) as [CallOutcome, ...CallOutcome[]]).optional().nullable(),
  nadDate: z.date().optional().nullable(),
  nadBookedLost: z.enum(["Booked", "Lost"]).optional().nullable(),
  // Add new fields to schema
  leadStatus: z.enum(leadStatuses.filter(s => s !== null) as [LeadStatus, ...LeadStatus[]]).optional().nullable(),
  leadResult: z.enum(leadResults.filter(r => r !== null) as [LeadResult, ...LeadResult[]]).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;


// Helper to check if a field is editable by the current user role
const isFieldEditable = (fieldName: keyof FormValues, role: "admin" | "employee"): boolean => {
  if (role === "admin") {
    return true; // Admin can edit all fields defined in the schema
  }
  // Employee editable fields
  const employeeEditableFields: (keyof FormValues)[] = [
    "callDate", "callBookedLost", "callStatus", "callOutcome",
    "nadDate", "nadBookedLost", "remark", "location",
    "leadStatus", "leadResult" // Add new fields
  ];
  return employeeEditableFields.includes(fieldName);
};

export function LeadEditForm({ lead, userRole, onSubmit, onCancel, isLoading }: LeadEditFormProps) {
    const { toast } = useToast(); // Get toast function

  // Initialize the form with lead data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Ensure defaultValues handle potential null/undefined values from lead object gracefully
    defaultValues: {
      name: lead.name || "",
      company: lead.company || "",
      email: lead.email || "",
      phone: lead.phone || "",
      source: lead.source || "",
      assignedTo: lead.assignedTo || "",
      location: lead.location || "",
      remark: lead.remark || "",
      callDate: lead.callDate ? parseISO(lead.callDate) : null, // Parse ISO string to Date
      callBookedLost: lead.callBookedLost || null,
      callStatus: lead.callStatus || null,
      callOutcome: lead.callOutcome || null,
      nadDate: lead.nadDate ? parseISO(lead.nadDate) : null, // Parse ISO string to Date
      nadBookedLost: lead.nadBookedLost || null,
      // Add new fields
      leadStatus: lead.leadStatus || null,
      leadResult: lead.leadResult || null,
    },
  });

   // Function to handle form submission
   const handleFormSubmit = async (values: FormValues) => {
        // Prepare the data to be submitted: only include changed fields
        const changedData: Partial<Lead> = { id: lead.id }; // Always include ID
        let hasChanges = false;

        // Compare each field in the submitted 'values' with the 'initialValues' (derived from props.lead)
        (Object.keys(values) as Array<keyof FormValues>).forEach(key => {
            const currentValue = values[key];
            const initialValue = form.formState.defaultValues?.[key];

            // Normalize empty strings to null for comparison and submission, except for potentially required fields like name/phone if needed
            const normalizedCurrentValue = currentValue === "" ? null : currentValue;
            const normalizedInitialValue = initialValue === "" ? null : initialValue;


            // Specific comparison for Date objects (compare date part only)
            if ((key === 'callDate' || key === 'nadDate') ) {
                 const currentDateStr = normalizedCurrentValue instanceof Date ? format(normalizedCurrentValue, 'yyyy-MM-dd') : null;
                 const initialDateStr = normalizedInitialValue instanceof Date ? format(normalizedInitialValue, 'yyyy-MM-dd') : null;

                if (currentDateStr !== initialDateStr) {
                     // Convert Date back to ISO string for submission if it's a Date object
                    changedData[key] = normalizedCurrentValue instanceof Date ? normalizedCurrentValue.toISOString() : null;
                    hasChanges = true;
                }
            } else if (normalizedCurrentValue !== normalizedInitialValue) {
                 // For non-date fields, check if the normalized value has changed
                if (isFieldEditable(key, userRole)) { // Only include if editable by role
                    (changedData as any)[key] = normalizedCurrentValue; // Send null if it was an empty string
                    hasChanges = true;
                }
            }
        });

        if (!hasChanges) {
            toast({ title: "No Changes", description: "No modifications were detected." });
            onCancel(); // Close the dialog if no changes
            return;
        }

        // Add lastUpdated timestamp only if there were changes
        changedData.lastUpdated = new Date().toISOString();

        console.log("Submitting changed data:", changedData);
        await onSubmit(changedData);
   };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
        {/* Basic Info - Read Only for Employee */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            disabled={!isFieldEditable("name", userRole) || isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Lead Name" {...field} readOnly={userRole === 'employee'}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            disabled={!isFieldEditable("phone", userRole) || isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} readOnly={userRole === 'employee'}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={!isFieldEditable("email", userRole) || isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} readOnly={userRole === 'employee'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="company"
            disabled={!isFieldEditable("company", userRole) || isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} value={field.value ?? ''} readOnly={userRole === 'employee'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="source"
            disabled={!isFieldEditable("source", userRole) || isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input placeholder="Lead Source" {...field} value={field.value ?? ''} readOnly={userRole === 'employee'}/>
                </FormControl>
                 <FormDescription>e.g., Website, Referral, Upload</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="assignedTo"
            disabled={!isFieldEditable("assignedTo", userRole) || isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                 {/* Replace with a Select dropdown populated with employees if needed */}
                <FormControl>
                  <Input placeholder="Employee ID or Name" {...field} value={field.value ?? ''} readOnly={userRole === 'employee'}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Call Details - Editable by Both */}
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
           <FormField
              control={form.control}
              name="callDate"
              disabled={!isFieldEditable("callDate", userRole) || isLoading}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Call Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!isFieldEditable("callDate", userRole) || isLoading} // Ensure button is also disabled
                        >
                          {field.value ? (
                            format(field.value, "PPP") // Assumes field.value is a Date object here
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined} // Pass undefined if null
                        onSelect={(date) => field.onChange(date ?? null)} // Update form state with Date or null
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="callBookedLost"
               disabled={!isFieldEditable("callBookedLost", userRole) || isLoading}
              render={({ field }) => (
                <FormItem className="space-y-3">
                   <FormLabel>Call Status (Booked/Lost)</FormLabel>
                   <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value ?? ""} // Use empty string if null
                      className="flex space-x-4 pt-2"
                       // Disable RadioGroup if field is not editable
                      disabled={!isFieldEditable("callBookedLost", userRole) || isLoading}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Booked" />
                        </FormControl>
                        <FormLabel className="font-normal">Booked</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Lost" />
                        </FormControl>
                        <FormLabel className="font-normal">Lost</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                           {/* Use a button or visually distinct element for clearing */}
                           <Button type="button" variant="ghost" size="sm" onClick={() => field.onChange(null)} disabled={!isFieldEditable("callBookedLost", userRole) || isLoading}>Clear</Button>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="callStatus"
              disabled={!isFieldEditable("callStatus", userRole) || isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Status (Connection)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === '__NULL__' ? null : value)}
                    value={field.value ?? "__NULL__"} // Use special value for null/undefined
                     // Disable Select if field is not editable
                    disabled={!isFieldEditable("callStatus", userRole) || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select connection status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       <SelectItem value="__NULL__">-- Clear --</SelectItem>
                       {callStatuses.filter(s => s !== null).map(status => (
                           <SelectItem key={status!} value={status!}>
                           {status}
                         </SelectItem>
                       ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="callOutcome"
              disabled={!isFieldEditable("callOutcome", userRole) || isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Outcome</FormLabel>
                   <Select
                     onValueChange={(value) => field.onChange(value === '__NULL__' ? null : value)}
                     value={field.value ?? "__NULL__"} // Use special value for null/undefined
                       // Disable Select if field is not editable
                     disabled={!isFieldEditable("callOutcome", userRole) || isLoading}
                    >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select call outcome" />
                      </SelectTrigger>
                    </FormControl>
                     <SelectContent>
                       <SelectItem value="__NULL__">-- Clear --</SelectItem>
                       {callOutcomes.filter(o => o !== null).map(outcome => (
                         <SelectItem key={outcome!} value={outcome!}>
                           {outcome}
                         </SelectItem>
                       ))}
                     </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {/* Prospect Specific Details - Editable by Both */}
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
                control={form.control}
                name="leadStatus"
                disabled={!isFieldEditable("leadStatus", userRole) || isLoading}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lead Status</FormLabel>
                        <Select
                            onValueChange={(value) => field.onChange(value === '__NULL__' ? null : value)}
                            value={field.value ?? "__NULL__"}
                            disabled={!isFieldEditable("leadStatus", userRole) || isLoading}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lead status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="__NULL__">-- Clear --</SelectItem>
                                {leadStatuses.filter(s => s !== null).map(status => (
                                    <SelectItem key={status!} value={status!}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="leadResult"
                disabled={!isFieldEditable("leadResult", userRole) || isLoading}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lead Result</FormLabel>
                        <Select
                            onValueChange={(value) => field.onChange(value === '__NULL__' ? null : value)}
                            value={field.value ?? "__NULL__"}
                            disabled={!isFieldEditable("leadResult", userRole) || isLoading}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lead result" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="__NULL__">-- Clear --</SelectItem>
                                {leadResults.filter(r => r !== null).map(result => (
                                    <SelectItem key={result!} value={result!}>
                                        {result}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
         </div>

        {/* NAD and Location - Editable by Both */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
           <FormField
              control={form.control}
              name="nadDate"
              disabled={!isFieldEditable("nadDate", userRole) || isLoading}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Action Date (NAD)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                           className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                           disabled={!isFieldEditable("nadDate", userRole) || isLoading} // Ensure button is also disabled
                        >
                          {field.value ? (
                            format(field.value, "PPP") // Assumes field.value is a Date object here
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                       <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => field.onChange(date ?? null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="nadBookedLost"
               disabled={!isFieldEditable("nadBookedLost", userRole) || isLoading}
              render={({ field }) => (
                <FormItem className="space-y-3">
                   <FormLabel>NAD Status (Booked/Lost)</FormLabel>
                   <FormControl>
                     <RadioGroup
                      onValueChange={field.onChange}
                       value={field.value ?? ""} // Use empty string if null
                      className="flex space-x-4 pt-2"
                       // Disable RadioGroup if field is not editable
                       disabled={!isFieldEditable("nadBookedLost", userRole) || isLoading}
                    >
                       <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Booked" />
                        </FormControl>
                        <FormLabel className="font-normal">Booked</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Lost" />
                        </FormControl>
                        <FormLabel className="font-normal">Lost</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Button type="button" variant="ghost" size="sm" onClick={() => field.onChange(null)} disabled={!isFieldEditable("nadBookedLost", userRole) || isLoading}>Clear</Button>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="location"
                disabled={!isFieldEditable("location", userRole) || isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Lead Location" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        </div>

        {/* Remarks - Editable by Both */}
        <FormField
          control={form.control}
          name="remark"
          disabled={!isFieldEditable("remark", userRole) || isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remark</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add remarks here..."
                  className="resize-y min-h-[100px]"
                  {...field}
                   value={field.value ?? ''} // Ensure value is never undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
           <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
           </Button>
          <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

