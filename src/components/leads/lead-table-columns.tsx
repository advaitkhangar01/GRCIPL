
// @ts-nocheck
// TODO: Fix typescript errors
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Lead, CallStatus, CallOutcome, LeadStatus, LeadResult } from "@/types/lead"; // Import new types
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button"; // Import buttonVariants
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Save, XCircle, Pencil, Loader2, Calendar as CalendarIcon } from "lucide-react"; // Added Loader2, CalendarIcon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem // Import Checkbox Item for Filtering
} from "@/components/ui/dropdown-menu";
import { format, parseISO, isValid } from 'date-fns'; // For date formatting, add isValid
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/alert-dialog"; // Import AlertDialog components


// Helper function to format date strings or return empty if null/invalid
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "";
  try {
    // Handle both Date objects and ISO strings
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) { // Check if the parsed date is valid
        return "Invalid Date";
    }
    return format(date, 'PP'); // Format like 'Sep 15, 2024'
  } catch (e) {
    console.warn("Invalid Date for formatting:", dateString, e);
    return "Invalid Date";
  }
};

// Define available options for filtering/editing (ensure null is handled distinctly)
export const callStatuses: Array<CallStatus> = [null, "Connected", "Not Connected"];
export const callOutcomes: Array<CallOutcome> = [null, "Prospect", "Call Back", "Not Interested", "Ringing", "Call Disconnected", "Won by GRC"];
const bookedLostOptions: Array<'Booked' | 'Lost' | null> = [null, "Booked", "Lost"];
export const leadStatuses: Array<LeadStatus> = [null, "Hot", "Warm", "Cold", "Very Cold", "Lost", "Booked"];
export const leadResults: Array<LeadResult> = [null, "VDNB", "Visit Proposed", "Visit Confirmed", "Visit not Done", "Booked"];


// Interface for inline editing props passed down
interface InlineEditProps {
  editingRowId: number | string | null;
  editedRowData: Partial<Lead> | null;
  handleInlineChange: (fieldName: keyof Lead, value: any) => void;
  startInlineEdit: (rowId: number | string, initialData: Lead) => void;
  saveInlineEdit: () => Promise<void>;
  cancelInlineEdit: () => void;
  isSavingInline: boolean; // Add saving state
}

export const getColumns = (
  isEditable: (field: keyof Lead) => boolean,
  onEditDialog: (lead: Lead) => void, // Renamed to avoid clash
  onDelete?: (leadId: number | string) => void, // Optional delete handler for Admin
  inlineEditProps?: InlineEditProps, // Optional inline editing props
  viewType: 'all' | 'prospects' | 'won' = 'all' // Add viewType
): ColumnDef<Lead>[] => {

  const {
    editingRowId = null,
    editedRowData = null,
    handleInlineChange = () => {},
    startInlineEdit = () => {},
    saveInlineEdit = async () => {},
    cancelInlineEdit = () => {},
    isSavingInline = false, // Default saving state
  } = inlineEditProps || {};

  const renderSelectCell = (accessorKey: keyof Lead, options: (string | null)[], placeholder: string) => ({ row }) => {
    const lead = row.original;
    const isEditing = lead.id === editingRowId;
    const canEditField = isEditable(accessorKey);

    if (isEditing && canEditField) {
      return (
        <Select
          value={editedRowData?.[accessorKey] ?? "__NULL__"}
          onValueChange={(value) => handleInlineChange(accessorKey, value === '__NULL__' ? null : value)}
          disabled={isSavingInline}
        >
          <SelectTrigger className={cn(
             "w-full", // Use full width to respect cell padding
             // Apply red text color if the outcome is Prospect or status is Hot
             ((accessorKey === 'callOutcome' && editedRowData?.['callOutcome'] === 'Prospect') || (accessorKey === 'leadStatus' && editedRowData?.['leadStatus'] === 'Hot')) && "text-prospect",
             // Apply green text color if the status is Booked or Won
             ((accessorKey === 'leadStatus' && editedRowData?.['leadStatus'] === 'Booked') || (accessorKey === 'callOutcome' && editedRowData?.['callOutcome'] === 'Won by GRC') || (accessorKey === 'leadResult' && editedRowData?.['leadResult'] === 'Booked')) && "text-booked"
          )}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__NULL__">-- Clear --</SelectItem>
            {options.filter(opt => opt !== null).map((opt) => (
              <SelectItem key={opt!} value={opt!} className={cn(
                 (opt === 'Prospect' || opt === 'Hot') && "text-prospect",
                 (opt === 'Booked' || opt === 'Won by GRC') && "text-booked"
                 )}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    const value = row.getValue(accessorKey);
    // Apply color based on value
    const isHotOrProspect = (accessorKey === 'callOutcome' && value === 'Prospect') || (accessorKey === 'leadStatus' && value === 'Hot');
    const isBookedOrWon = (accessorKey === 'leadStatus' && value === 'Booked') || (accessorKey === 'callOutcome' && value === 'Won by GRC') || (accessorKey === 'leadResult' && value === 'Booked');

    return <div className={cn(
        isHotOrProspect && "text-prospect font-medium",
        isBookedOrWon && "text-booked font-medium"
        )}>{value || "-"}</div>; // Display '-' if null/empty
  };

  const renderDateCell = (accessorKey: keyof Lead) => ({ row }) => {
    const lead = row.original;
    const isEditing = lead.id === editingRowId;
    const canEditField = isEditable(accessorKey);

    if (isEditing && canEditField) {
      // Ensure the value passed to Calendar's selected prop is a Date object or undefined
      const selectedDate = editedRowData?.[accessorKey] ? new Date(editedRowData[accessorKey] as string | Date) : undefined;
      const displayValue = selectedDate ? format(selectedDate, "PPP") : <span>Pick date</span>;


      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              size="sm" // Keep size small if desired
              className={cn(
                "w-full justify-start text-left font-normal", // Use full width
                !editedRowData?.[accessorKey] && "text-muted-foreground"
              )}
              disabled={isSavingInline}
            >
              <CalendarIcon className="mr-1 h-3 w-3" />
              {displayValue}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate} // Pass Date object or undefined
              onSelect={(date) => handleInlineChange(accessorKey, date)} // date is Date object or undefined
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }
    const displayDate = formatDate(row.getValue(accessorKey));
    return <div>{displayDate || "-"}</div>; // Show dash if no date or invalid
  };


 const renderBookedLostBadge = (callDateKey: keyof Lead, bookedLostKey: keyof Lead) => ({ row }) => {
      const displayDate = formatDate(row.getValue(callDateKey));
      const bookedLostStatus = row.original[bookedLostKey];
      return (
        <div>
          {displayDate || "-"}
          {bookedLostStatus && (
             <Badge
               variant={bookedLostStatus === 'Booked' ? 'booked' : 'secondary'}
               className="ml-2 whitespace-nowrap"
             >
              {bookedLostStatus}
             </Badge>
          )}
        </div>
      );
  };


  let columns: ColumnDef<Lead>[] = [
    // Keep select column if needed for bulk actions, otherwise remove/hide
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
           disabled={isSavingInline || !!editingRowId} // Disable if editing any row
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
          disabled={isSavingInline || row.id === editingRowId} // Disable checkbox while inline saving this row
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
        accessorKey: "id", // Use the Opportunity ID
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            disabled={isSavingInline}
          >
            Opp. ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="text-xs">{row.getValue("id")}</div>,
        enableHiding: true, // Allow hiding Opp ID
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          disabled={isSavingInline} // Disable sorting while saving
        >
          Client Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      enableHiding: false, // Usually want name visible
    },
    {
      accessorKey: "phone",
      header: "Mobile Number",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
     {
      accessorKey: "assignedTo",
       header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           disabled={isSavingInline}
        >
          Calling SM
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("assignedTo") || "Unassigned"}</div>,
      enableHiding: false, // Always show Assigned To
        filterFn: (row, id, value) => {
             if (!value || value.length === 0) return true;
             const assignedTo = row.getValue(id) || "Unassigned"; // Handle null/undefined
            return value.includes(assignedTo);
        }
    },
     {
      accessorKey: "source",
       header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           disabled={isSavingInline}
        >
          Source
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("source") || "-"}</div>,
      enableHiding: true, // Allow hiding source column
       filterFn: (row, id, value) => {
         if (!value || value.length === 0) return true;
         const sourceVal = row.getValue(id) || "Unknown"; // Treat null/empty as "Unknown" for filtering
         return value.includes(sourceVal);
       }
    },
    // --- Inline Editable Columns ---
    {
      accessorKey: "callDate",
       header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           disabled={isSavingInline}
        >
          Call Dt / Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: renderBookedLostBadge("callDate", "callBookedLost"),
      sortingFn: 'datetime',
    },
     {
      accessorKey: "callBookedLost", // Hidden column for data, shown with callDate
      header: () => null,
      cell: () => null,
       enableHiding: true, // Typically hidden
    },
    {
      accessorKey: "callStatus",
      header: "Call Status",
      cell: renderSelectCell("callStatus", callStatuses, "Call Status"),
      filterFn: (row, id, value) => {
         if (!value || value.length === 0) return true;
         const status = row.getValue(id) ?? "__NULL__"; // Handle null
         return value.includes(status);
      }
    },
    {
      accessorKey: "callOutcome",
      header: "Call Outcome",
      cell: renderSelectCell("callOutcome", callOutcomes, "Call Outcome"),
      filterFn: (row, id, value) => {
         if (!value || value.length === 0) return true;
         const outcome = row.getValue(id) ?? "__NULL__"; // Handle null
         return value.includes(outcome);
      }
    },
     {
      accessorKey: "nadDate",
       header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           disabled={isSavingInline}
        >
          NAD / Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: renderBookedLostBadge("nadDate", "nadBookedLost"),
      sortingFn: 'datetime',
    },
     {
      accessorKey: "nadBookedLost", // Hidden column for data, shown with nadDate
      header: () => null,
      cell: () => null,
       enableHiding: true, // Typically hidden
    },
     // --- Prospect Specific Columns (Conditionally Added) ---
     ...(viewType === 'prospects' ? [
         {
            accessorKey: "leadStatus",
            header: "Lead Status",
            cell: renderSelectCell("leadStatus", leadStatuses, "Lead Status"),
            filterFn: (row, id, value) => {
                if (!value || value.length === 0) return true;
                const status = row.getValue(id) ?? "__NULL__"; // Handle null
                return value.includes(status);
            }
         },
         {
            accessorKey: "leadResult",
            header: "Lead Result",
            cell: renderSelectCell("leadResult", leadResults, "Lead Result"),
            filterFn: (row, id, value) => {
                if (!value || value.length === 0) return true;
                const result = row.getValue(id) ?? "__NULL__"; // Handle null
                return value.includes(result);
            }
         }
     ] : []),
    {
      accessorKey: "remark",
      header: "Remark",
       cell: ({ row }) => {
         const lead = row.original;
         const isEditing = lead.id === editingRowId;
         const canEditField = isEditable("remark");

         if (isEditing && canEditField) {
           return (
             <Textarea
               value={editedRowData?.remark ?? ""}
               onChange={(e) => handleInlineChange("remark", e.target.value)}
               rows={1} // Start with single row
               className="w-full" // Use full width
               disabled={isSavingInline}
             />
           );
         }
        return (
        <div className="truncate max-w-[200px]">{row.getValue("remark") || "-"}</div> // Restore truncation for display
        );
      },
    },
    // --- End Inline Editable Columns ---
     {
      accessorKey: "location",
       header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           disabled={isSavingInline}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
       cell: ({ row }) => {
         const lead = row.original;
         const isEditing = lead.id === editingRowId;
         const canEditField = isEditable("location");

         if (isEditing && canEditField) {
           return (
             <Input
               value={editedRowData?.location ?? ""}
               onChange={(e) => handleInlineChange("location", e.target.value)}
               className="w-full" // Use full width
               disabled={isSavingInline}
             />
           );
         }
        return <div>{row.getValue("location") || "-"}</div>;
      },
      enableHiding: true, // Allow hiding location
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => <div>{row.getValue("company") || "-"}</div>,
      enableHiding: true, // Allow hiding company
    },
     {
      accessorKey: "lastUpdated",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           disabled={isSavingInline}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-xs">{formatDate(row.getValue("lastUpdated"))}</div>,
       sortingFn: 'datetime',
       enableHiding: true, // Might hide by default
    },
     {
      accessorKey: "uploadDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           disabled={isSavingInline}
        >
          Upload Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-xs">{formatDate(row.getValue("uploadDate"))}</div>,
       sortingFn: 'datetime',
       enableHiding: true, // Might hide by default
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const lead = row.original;
        const isEditingThisRow = lead.id === editingRowId;
        const canEditAnyInline = [
            "callDate", "callStatus", "callOutcome", "callBookedLost",
            "nadDate", "nadBookedLost", "remark", "location",
            "leadStatus", "leadResult" // Add new fields here
        ].some(f => isEditable(f as keyof Lead));

        if (isEditingThisRow && inlineEditProps) {
            return (
                <div className="flex items-center space-x-1">
                     <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={saveInlineEdit} title="Save Changes" disabled={isSavingInline}>
                       {isSavingInline ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700" onClick={cancelInlineEdit} title="Cancel Edit" disabled={isSavingInline}>
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
            );
        }

        return (
           <AlertDialog> {/* Wrap DropdownMenu and AlertDialogContent */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" disabled={isSavingInline || !!editingRowId}> {/* Disable actions when any row is editing */}
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {inlineEditProps && canEditAnyInline && (
                    <DropdownMenuItem onClick={() => startInlineEdit(lead.id, lead)} disabled={isSavingInline || !!editingRowId}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Inline
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onEditDialog(lead)} disabled={isSavingInline || !!editingRowId}>
                       <Edit className="mr-2 h-4 w-4" />
                       Edit in Dialog
                     </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(lead.phone)} disabled={isSavingInline || !!editingRowId}>
                    Copy Phone
                  </DropdownMenuItem>
                  {onDelete && ( // Conditionally render delete for admin
                    <>
                      <DropdownMenuSeparator />
                       {/* Use AlertDialogTrigger inside DropdownMenuItem */}
                       <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onSelect={(e) => e.preventDefault()} // Prevent default closing on select
                              disabled={isSavingInline || !!editingRowId}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Lead
                            </DropdownMenuItem>
                       </AlertDialogTrigger>
                     </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
               {/* Confirmation Dialog Content (placed outside DropdownMenu but inside the parent AlertDialog) */}
               {onDelete && (
                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                       <AlertDialogDescription>
                         This action cannot be undone. This will permanently delete the lead
                         "{lead.name}".
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction
                           className={cn(buttonVariants({ variant: "destructive" }))}
                           onClick={() => onDelete(lead.id)}
                         >
                           Delete
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
               )}
           </AlertDialog>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Filter out columns that should only appear in the 'prospects' view if viewType is not 'prospects'
  if (viewType !== 'prospects') {
     columns = columns.filter(col => col.accessorKey !== 'leadStatus' && col.accessorKey !== 'leadResult');
  }


  return columns;
};
    