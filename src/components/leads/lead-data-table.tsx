
// @ts-nocheck
// TODO: Fix typescript errors
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn, // Import FilterFn type
} from "@tanstack/react-table";
import { rankItem } from '@tanstack/match-sorter-utils'; // Import for advanced filtering

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter as FilterIcon } from "lucide-react";
import type { Lead, CallStatus, CallOutcome, LeadStatus, LeadResult } from "@/types/lead"; // Import new types
import { callStatuses, callOutcomes, leadStatuses, leadResults, getColumns } from './lead-table-columns'; // Import options and getColumns
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Import cn
import { generateMockLeads } from "@/lib/mock-data"; // Assuming mock data lives here

// Declare module augmentation for react-table FilterFns
declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: {passed: boolean} // Add itemRank to FilterMeta
  }
}


interface DataTableProps<TData extends Lead, TValue> {
  data: TData[]; // Changed prop name from initialData to data
  onEditDialog: (lead: TData) => void; // Callback for editing in dialog
  onDelete?: (leadId: number | string) => void; // Optional callback for deleting (Admin)
  onUpdate: (updatedLead: Partial<Lead>) => Promise<{ success: boolean }>; // Callback for saving updates
  userRole: 'admin' | 'employee'; // Pass user role
  availableEmployees?: string[]; // For admin filtering
  rowSelection?: {}; // Add rowSelection prop
  onRowSelectionChange?: (updater: any) => void; // Add handler prop
  viewType?: 'all' | 'prospects' | 'won'; // Add view type prop
}

// Fuzzy filter function for global search
const fuzzyFilter: FilterFn<Lead> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({ itemRank });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};


export function LeadDataTable<TData extends Lead, TValue>({
  data: initialData, // Rename prop back to initialData internally or use data directly
  onEditDialog,
  onDelete,
  onUpdate,
  userRole,
  availableEmployees = [],
  rowSelection = {},
  onRowSelectionChange,
  viewType = 'all', // Default to 'all' view type
}: Omit<DataTableProps<TData, TValue>, 'columns'>) { // Omit columns from props
  const [data, setData] = React.useState<TData[]>(initialData || []); // Ensure initialData is an array
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  // Removed duplicate setColumnVisibility
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
     lastUpdated: false,
     company: userRole === 'employee', // Hide for employee by default
     source: true, // Show source by default
     email: true,
     assignedTo: userRole === 'employee' ? false : true, // Hide for employee
     id: true, // Show Opp ID by default
     uploadDate: false, // Hide upload date by default
     location: true, // Show location
     callBookedLost: true, // Hide helper columns
     nadBookedLost: true,
      // Hide prospect columns by default unless viewType is prospects
      leadStatus: viewType !== 'prospects',
      leadResult: viewType !== 'prospects',
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const { toast } = useToast();

  // Inline Editing State
  const [editingRowId, setEditingRowId] = React.useState<number | string | null>(null);
  const [editedRowData, setEditedRowData] = React.useState<Partial<Lead> | null>(null);
  const [isSavingInline, setIsSavingInline] = React.useState(false);

   // Extract unique sources for filtering
   const availableSources = React.useMemo(() => {
      // Check if initialData is valid array before mapping
      if (!Array.isArray(initialData)) {
          console.warn("Initial data is not an array:", initialData);
          return [];
      }
      const sources = new Set(initialData.map(lead => lead.source || "Unknown").filter(Boolean));
      return Array.from(sources);
   }, [initialData]);


  // Update local data when initialData prop changes
  React.useEffect(() => {
    setData(initialData || []); // Ensure initialData is an array when updating state
    // If the currently editing row is no longer in the new data, cancel edit
    if (editingRowId && !(initialData || []).some(d => d.id === editingRowId)) {
      cancelInlineEdit();
    }
  }, [initialData, editingRowId]);


  const startInlineEdit = (rowId: number | string, initialData: Lead) => {
    if (editingRowId && editingRowId !== rowId) {
        toast({ variant: "destructive", title: "Edit Conflict", description: "Please save or cancel the current edit first." });
        return;
    }
    setEditingRowId(rowId);
    // Include new fields in editable list
    const editableFields: (keyof Lead)[] = [
        "callDate", "callBookedLost", "callStatus", "callOutcome",
        "nadDate", "nadBookedLost", "remark", "location",
        "leadStatus", "leadResult" // Add new fields
    ];
    const initialEditableData: Partial<Lead> = {};
    editableFields.forEach(field => {
        if (isEmployeeEditable(field) || userRole === 'admin') {
             if (Object.prototype.hasOwnProperty.call(initialData, field)) {
                 initialEditableData[field] = initialData[field];
             }
        }
    });
     initialEditableData.id = rowId;
    setEditedRowData(initialEditableData);
  };

   const handleInlineChange = (fieldName: keyof Lead, value: any) => {
     setEditedRowData(prev => ({ ...prev, [fieldName]: value }));
   };

   const cancelInlineEdit = () => {
     setEditingRowId(null);
     setEditedRowData(null);
     setIsSavingInline(false);
   };

  const saveInlineEdit = async () => {
    if (!editingRowId || !editedRowData) return;

    setIsSavingInline(true);
     const leadToUpdate = data.find(d => d.id === editingRowId);
     if (!leadToUpdate) {
       toast({ variant: "destructive", title: "Error", description: "Could not find the lead to update." });
       setIsSavingInline(false);
       return;
     }

    const updatePayload: Partial<Lead> = { id: editingRowId };
     let hasChanges = false;
      // Include new fields in editable list for comparison
     const editableFields: (keyof Lead)[] = [
        "callDate", "callBookedLost", "callStatus", "callOutcome",
        "nadDate", "nadBookedLost", "remark", "location",
        "leadStatus", "leadResult" // Add new fields
     ];

     editableFields.forEach(field => {
         if (Object.prototype.hasOwnProperty.call(editedRowData, field)) {
              const initialValue = leadToUpdate[field];
              const editedValue = editedRowData[field];

              if ((field === 'callDate' || field === 'nadDate')) {
                  const initialDateStr = initialValue ? new Date(initialValue).toISOString().split('T')[0] : null;
                  const editedDateStr = editedValue ? new Date(editedValue).toISOString().split('T')[0] : null;
                   if (initialDateStr !== editedDateStr) {
                       updatePayload[field] = editedValue ? new Date(editedValue).toISOString() : null;
                       hasChanges = true;
                   }
              } else if (initialValue !== editedValue) {
                   if (isEmployeeEditable(field) || userRole === 'admin') {
                       updatePayload[field] = editedValue === "" ? null : editedValue; // Send null if empty string
                       hasChanges = true;
                   }
              }
         }
     });


     if (!hasChanges) {
         toast({ title: "No Changes", description: "No modifications were made." });
         cancelInlineEdit();
         return;
     }

     updatePayload.lastUpdated = new Date().toISOString();


    try {
       const result = await onUpdate(updatePayload);
       if (result.success) {
         toast({ title: "Update Successful", description: "Lead details saved." });
          setData(prevData => prevData.map(d =>
             d.id === editingRowId ? { ...d, ...updatePayload } : d
          ));
         cancelInlineEdit(); // Exit editing mode
       } else {
         toast({ variant: "destructive", title: "Update Failed", description: "Could not save changes." });
       }
    } catch (error) {
      console.error("Inline save error:", error);
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred during save." });
    } finally {
      setIsSavingInline(false);
    }
  };


   const isEmployeeEditable = (field: keyof Lead): boolean => {
     // Include new fields in employee editable list
     const editableFields: (keyof Lead)[] = [
       "callDate", "callBookedLost", "callStatus", "callOutcome",
       "nadDate", "nadBookedLost", "remark", "location",
       "leadStatus", "leadResult" // Add new fields
     ];
     return editableFields.includes(field);
   };

   const columns = React.useMemo(
     () => getColumns(
       userRole === 'admin' ? () => true : isEmployeeEditable,
       onEditDialog,
       userRole === 'admin' && viewType !== 'won' ? onDelete : undefined, // Allow delete except in 'won' view
       {
         editingRowId,
         editedRowData,
         handleInlineChange,
         startInlineEdit,
         saveInlineEdit,
         cancelInlineEdit,
         isSavingInline,
       },
       viewType // Pass viewType to getColumns
     ),
     [userRole, onEditDialog, onDelete, editingRowId, editedRowData, isSavingInline, viewType] // Add viewType dependency
   );



  const table = useReactTable({
    data,
    columns,
    filterFns: { // Register fuzzy filter
        fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: onRowSelectionChange,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy', // Set global filter function
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
     enableRowSelection: !!onRowSelectionChange,
     meta: {
       updateData: (rowIndex: number, columnId: string, value: unknown) => {
         setData(old =>
           old.map((row, index) => {
             if (index === rowIndex) {
               return {
                 ...old[rowIndex]!,
                 [columnId]: value,
               }
             }
             return row
           })
         )
       },
       editingRowId: editingRowId,
       isSavingInline: isSavingInline,
     },
  });

   const getFilterOptions = (columnId: string): string[] => {
    switch (columnId) {
      case 'callStatus':
        return callStatuses.filter(s => s !== null) as string[] || [];
      case 'callOutcome':
        return callOutcomes.filter(o => o !== null) as string[] || [];
      case 'leadStatus': // Add filter options for leadStatus
          return leadStatuses.filter(s => s !== null) as string[] || [];
      case 'leadResult': // Add filter options for leadResult
          return leadResults.filter(r => r !== null) as string[] || [];
      case 'assignedTo':
          const employees = userRole === 'admin' ? availableEmployees : [];
          // Ensure "Unassigned" is only added if not already present
          const uniqueEmployees = Array.from(new Set(employees));
          if (!uniqueEmployees.includes("Unassigned")) {
              uniqueEmployees.push("Unassigned");
          }
          return uniqueEmployees;
      case 'source':
          return availableSources;
      default:
        return [];
    }
  };


  return (
    <div className="w-full space-y-4">
      {/* Filters and Actions Bar - Adjusted for responsiveness */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-4">
         <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-full sm:max-w-xs md:max-w-sm h-9 border-primary ring-primary focus:ring-primary" // Adjusted max width
        />

        <div className="flex items-center gap-2 self-start sm:self-center mt-2 sm:mt-0"> {/* Align buttons */}
         {/* Column Visibility Dropdown */}
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm"> {/* Removed ml-auto */}
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  // Hide prospect columns toggle if not in prospects view
                  if (viewType !== 'prospects' && (column.id === 'leadStatus' || column.id === 'leadResult')) {
                      return null;
                  }
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                       {/* Improve display name generation */}
                       {column.id.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase()).trim()}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

            {/* Filter Dropdown */}
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="default" size="sm">
                 <FilterIcon className="mr-2 h-4 w-4" /> Filters
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-[250px] max-h-[400px] overflow-y-auto"> {/* Add max height and scroll */}
               <DropdownMenuLabel>Filter by</DropdownMenuLabel>
               <DropdownMenuSeparator />
                 {/* Call Status Filter */}
                 {table.getColumn('callStatus') && getFilterOptions('callStatus').length > 0 && (
                    <>
                     <DropdownMenuLabel className="text-xs font-semibold px-2 pt-2">Call Status</DropdownMenuLabel>
                     {getFilterOptions('callStatus').map((status) => (
                       <DropdownMenuCheckboxItem
                          key={status}
                          checked={(table.getColumn('callStatus')?.getFilterValue() as string[] | undefined)?.includes(status) ?? false}
                          onCheckedChange={(checked) => {
                            const currentFilter = (table.getColumn('callStatus')?.getFilterValue() as string[] | undefined) ?? [];
                            const newFilter = checked
                              ? [...currentFilter, status]
                              : currentFilter.filter(s => s !== status);
                             table.getColumn('callStatus')?.setFilterValue(newFilter.length ? newFilter : undefined);
                          }}
                       >
                         {status}
                       </DropdownMenuCheckboxItem>
                     ))}
                      <DropdownMenuSeparator />
                    </>
                 )}
                  {/* Call Outcome Filter */}
                 {table.getColumn('callOutcome') && getFilterOptions('callOutcome').length > 0 && (
                    <>
                     <DropdownMenuLabel className="text-xs font-semibold px-2 pt-2">Call Outcome</DropdownMenuLabel>
                     {getFilterOptions('callOutcome').map((outcome) => (
                       <DropdownMenuCheckboxItem
                          key={outcome}
                          checked={(table.getColumn('callOutcome')?.getFilterValue() as string[] | undefined)?.includes(outcome) ?? false}
                           onCheckedChange={(checked) => {
                            const currentFilter = (table.getColumn('callOutcome')?.getFilterValue() as string[] | undefined) ?? [];
                            const newFilter = checked
                              ? [...currentFilter, outcome]
                              : currentFilter.filter(s => s !== outcome);
                             table.getColumn('callOutcome')?.setFilterValue(newFilter.length ? newFilter : undefined);
                          }}
                       >
                         {outcome}
                       </DropdownMenuCheckboxItem>
                     ))}
                      <DropdownMenuSeparator />
                    </>
                 )}
                 {/* Lead Status Filter (Only show if in prospects view) */}
                 {viewType === 'prospects' && table.getColumn('leadStatus') && getFilterOptions('leadStatus').length > 0 && (
                     <>
                         <DropdownMenuLabel className="text-xs font-semibold px-2 pt-2">Lead Status</DropdownMenuLabel>
                         {getFilterOptions('leadStatus').map((status) => (
                             <DropdownMenuCheckboxItem
                                 key={status}
                                 checked={(table.getColumn('leadStatus')?.getFilterValue() as string[] | undefined)?.includes(status) ?? false}
                                 onCheckedChange={(checked) => {
                                     const currentFilter = (table.getColumn('leadStatus')?.getFilterValue() as string[] | undefined) ?? [];
                                     const newFilter = checked
                                         ? [...currentFilter, status]
                                         : currentFilter.filter(s => s !== status);
                                     table.getColumn('leadStatus')?.setFilterValue(newFilter.length ? newFilter : undefined);
                                 }}
                             >
                                 {status}
                             </DropdownMenuCheckboxItem>
                         ))}
                         <DropdownMenuSeparator />
                     </>
                 )}
                 {/* Lead Result Filter (Only show if in prospects view) */}
                 {viewType === 'prospects' && table.getColumn('leadResult') && getFilterOptions('leadResult').length > 0 && (
                     <>
                         <DropdownMenuLabel className="text-xs font-semibold px-2 pt-2">Lead Result</DropdownMenuLabel>
                         {getFilterOptions('leadResult').map((result) => (
                             <DropdownMenuCheckboxItem
                                 key={result}
                                 checked={(table.getColumn('leadResult')?.getFilterValue() as string[] | undefined)?.includes(result) ?? false}
                                 onCheckedChange={(checked) => {
                                     const currentFilter = (table.getColumn('leadResult')?.getFilterValue() as string[] | undefined) ?? [];
                                     const newFilter = checked
                                         ? [...currentFilter, result]
                                         : currentFilter.filter(s => s !== result);
                                     table.getColumn('leadResult')?.setFilterValue(newFilter.length ? newFilter : undefined);
                                 }}
                             >
                                 {result}
                             </DropdownMenuCheckboxItem>
                         ))}
                         <DropdownMenuSeparator />
                     </>
                 )}
                 {/* Assigned To Filter (Admin only) */}
                 {userRole === 'admin' && table.getColumn('assignedTo') && getFilterOptions('assignedTo').length > 0 && (
                    <>
                     <DropdownMenuLabel className="text-xs font-semibold px-2 pt-2">Assigned To</DropdownMenuLabel>
                     {getFilterOptions('assignedTo').map((employee) => (
                       <DropdownMenuCheckboxItem
                          key={employee}
                          checked={(table.getColumn('assignedTo')?.getFilterValue() as string[] | undefined)?.includes(employee) ?? false}
                           onCheckedChange={(checked) => {
                            const currentFilter = (table.getColumn('assignedTo')?.getFilterValue() as string[] | undefined) ?? [];
                            const newFilter = checked
                              ? [...currentFilter, employee]
                              : currentFilter.filter(s => s !== employee);
                             table.getColumn('assignedTo')?.setFilterValue(newFilter.length ? newFilter : undefined);
                          }}
                       >
                         {employee || "Unassigned"}
                       </DropdownMenuCheckboxItem>
                     ))}
                     <DropdownMenuSeparator />
                    </>
                 )}
                 {/* Source Filter */}
                 {table.getColumn('source') && getFilterOptions('source').length > 0 && (
                    <>
                     <DropdownMenuLabel className="text-xs font-semibold px-2 pt-2">Source</DropdownMenuLabel>
                     {getFilterOptions('source').map((source) => (
                       <DropdownMenuCheckboxItem
                          key={source}
                          checked={(table.getColumn('source')?.getFilterValue() as string[] | undefined)?.includes(source) ?? false}
                           onCheckedChange={(checked) => {
                            const currentFilter = (table.getColumn('source')?.getFilterValue() as string[] | undefined) ?? [];
                            const newFilter = checked
                              ? [...currentFilter, source]
                              : currentFilter.filter(s => s !== source);
                             table.getColumn('source')?.setFilterValue(newFilter.length ? newFilter : undefined);
                          }}
                       >
                         {source || "Unknown"}
                       </DropdownMenuCheckboxItem>
                     ))}
                    </>
                 )}
             </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <div className="rounded-md border shadow-sm bg-card min-w-[800px]"> {/* Set a min-width for the inner table container */}
            <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}> {/* Removed class */}
                    {headerGroup.headers.map((header) => {
                    return (
                        <TableHead key={header.id}> {/* Removed class */}
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </TableHead>
                    );
                    })}
                </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                        // "border-b border-primary/10 hover:bg-muted/50 data-[state=selected]:bg-muted", // Adjusted border and hover
                        editingRowId === row.original.id && "bg-muted/80 outline outline-1 outline-primary" // Enhanced editing highlight
                        )}
                    >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}> {/* Removed class */}
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                        </TableCell>
                    ))}
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center" // Removed class
                    >
                    No results found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      </div>


      {/* Pagination - Adjusted for responsiveness */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
         <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left"> {/* Centered text on small screens */}
          {onRowSelectionChange && ( // Only show selection count if selection is enabled
               <>
                   {table.getFilteredSelectedRowModel().rows.length} of{" "}
                   {table.getFilteredRowModel().rows.length} row(s) selected.
               </>
           )}
            {!onRowSelectionChange && ( // Show total rows if selection is not enabled
                 <>
                     Total {table.getFilteredRowModel().rows.length} row(s).
                 </>
             )}
        </div>
        <div className="flex items-center space-x-2 justify-center sm:justify-end"> {/* Centered buttons on small screens */}
           <span className="text-sm text-muted-foreground hidden sm:inline-block"> {/* Hide page count text on extra small screens */}
             Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
           </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
    