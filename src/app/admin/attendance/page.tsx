
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD

=======
>>>>>>> 6b1a0c8 (Your commit message)
import { Calendar } from "@/components/ui/calendar"; 
import { format, parseISO, isValid, differenceInHours, differenceInMinutes, parse } from 'date-fns';
import type { AttendanceRecord } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";
import { fetchAllAttendance } from "@/lib/mock-data"; 
import { Skeleton } from "@/components/ui/skeleton"; 
<<<<<<< HEAD

=======
>>>>>>> 6b1a0c8 (Your commit message)
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import { format, parseISO, isValid, differenceInHours, differenceInMinutes, parse } from 'date-fns';
import type { AttendanceRecord } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";
import { fetchAllAttendance } from "@/lib/mock-data"; // Import mock function
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
<<<<<<< HEAD

=======
>>>>>>> 6b1a0c8 (Your commit message)

// Helper to get status badge
const getStatusBadge = (inTime: string | null, outTime: string | null): React.ReactNode => {
   if (inTime && outTime) {
       return <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">Present</Badge>;
   } else if (inTime && !outTime) {
       return <Badge variant="outline" className="border-yellow-500 text-yellow-600">In Office</Badge>;
   } else {
       return <Badge variant="destructive">Absent</Badge>;
   }
};

// Helper to calculate duration
const calculateDuration = (inTime: string | null, outTime: string | null): string => {
  if (!inTime || !outTime) return "-";
  try {
    // Assume times are on the same day for calculation purposes
    const inDate = parse(`1970-01-01T${inTime}:00`, "yyyy-MM-dd'T'HH:mm:ss", new Date());
    const outDate = parse(`1970-01-01T${outTime}:00`, "yyyy-MM-dd'T'HH:mm:ss", new Date());

    if (!isValid(inDate) || !isValid(outDate) || outDate <= inDate) {
      return "-";
    }

    const hours = differenceInHours(outDate, inDate);
    const minutes = differenceInMinutes(outDate, inDate) % 60;
    return `${hours}h ${minutes}m`;
  } catch (e) {
    console.error("Error calculating duration:", e);
    return "-";
  }
};

// Helper to format HH:MM time or return '-'
const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return "-";
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  try {
     const date = parseISO(timeString);
     if (isValid(date)) {
         return format(date, 'HH:mm');
     }
  } catch (e) {
     // Ignore
  }
  return "-"; // Fallback
};


interface AttendanceStatusModifiers {
  present: Date[];
  inOffice: Date[];
  absent: Date[];
}

export default function AdminAttendancePage() {
  const [allAttendance, setAllAttendance] = React.useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = React.useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = React.useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = React.useState<string>("all");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [attendanceModifiers, setAttendanceModifiers] = React.useState<AttendanceStatusModifiers>({ present: [], inOffice: [], absent: [] });
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const userRole = "admin";

  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllAttendance();
        setAllAttendance(data);
        // Extract unique employee IDs
        const uniqueEmployees = [...new Set(data.map(record => record.employeeId))].sort();
        setEmployees(uniqueEmployees);

      } catch (error) {
        console.error("Failed to load attendance data:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load attendance records." });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

  }, [toast]); // fetchAllAttendance is stable

  }, [toast]);


  // Effect to filter attendance and update calendar modifiers when employee or data changes
  React.useEffect(() => {
    const filtered = selectedEmployee === "all"
      ? allAttendance
      : allAttendance.filter(record => record.employeeId === selectedEmployee);

    setFilteredAttendance(filtered);

    // Calculate modifiers based on the *filtered* data
    const modifiers: AttendanceStatusModifiers = { present: [], inOffice: [], absent: [] };
    const processedDates = new Set<string>(); // Track dates already processed for 'all' employees

    filtered.forEach(record => {
       try {
        const recordDate = parseISO(record.date);
        if (!isValid(recordDate)) return; // Skip invalid dates

        const dateStr = format(recordDate, 'yyyy-MM-dd');

        // When viewing 'all', only add a date to a modifier list once
        if (selectedEmployee === 'all' && processedDates.has(dateStr)) {
             return;
        }

        if (record.inTime && record.outTime) {
          modifiers.present.push(recordDate);
        } else if (record.inTime && !record.outTime) {
          modifiers.inOffice.push(recordDate);
        } else {

<<<<<<< HEAD
=======

>>>>>>> 6b1a0c8 (Your commit message)
           // For 'all', only mark absent if *all* filtered records for that date are absent?
           // Simpler: Mark absent if *any* record is absent when filtering by employee,
           // or if a date has records but none are present/inOffice when 'all' is selected.
           // Let's mark absent if the specific record is absent. Refinement might be needed for 'all'.

           modifiers.absent.push(recordDate);
        }
        processedDates.add(dateStr);

       } catch (e) {
           console.warn("Error parsing date for calendar modifier:", record.date, e);
       }
    });

    setAttendanceModifiers(modifiers);
  }, [selectedEmployee, allAttendance]);



  const handleDateSelect = React.useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
<<<<<<< HEAD
=======

>>>>>>> 6b1a0c8 (Your commit message)

   // Get attendance details for the selected date
   const selectedDateRecords = React.useMemo(() => {
     if (!selectedDate) return [];
     const dateStr = format(selectedDate, 'yyyy-MM-dd');
     return filteredAttendance.filter(record => record.date === dateStr);
   }, [selectedDate, filteredAttendance]);


  return (
    <AppLayout userRole={userRole}>
      <h1 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">Employee Attendance Records</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left side: Filter and Calendar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
               <CardTitle>Filter & View</CardTitle>
               <CardDescription>Select an employee and date to view attendance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Employee Filter Dropdown */}
                <div className="w-full">
                    <label htmlFor="employee-filter" className="text-sm font-medium text-muted-foreground mb-1 block">Employee</label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={isLoading}>
                    <SelectTrigger id="employee-filter" className="w-full">
                        <SelectValue placeholder="Filter by Employee" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employees.map(emp => (
                        <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                 </div>

                 {/* Calendar */}
                 <div className="flex justify-center">
                     {isLoading ? (
                         <Skeleton className="w-full h-[300px] rounded-md" />
                     ) : (
                       <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}

                          className="rounded-md border w-full" 

                          className="rounded-md border w-full" // Adjust width as needed

                           modifiers={{
                               present: attendanceModifiers.present,
                               inOffice: attendanceModifiers.inOffice,
                               absent: attendanceModifiers.absent,
                           }}
                           modifiersStyles={{

                                present: { 

                                present: { // Green solid circle

                                    border: '2px solid hsl(var(--booked))',
                                    backgroundColor: 'hsl(var(--booked))',
                                    color: 'hsl(var(--booked-foreground))',
                                    borderRadius: '50%',
                                },

                                inOffice: { 
                                     border: '2px solid #F59E0B', 
                                     borderRadius: '50%',
                                 },
                                absent: { 
                                     border: '2px solid hsl(var(--destructive))',
                                     backgroundColor: 'hsl(var(--destructive))',
                                      color: 'hsl(var(--destructive-foreground))',
                                     borderRadius: '0%', 

                                inOffice: { // Yellow outline circle
                                     border: '2px solid #F59E0B', // Tailwind yellow-500
                                     borderRadius: '50%',
                                 },
                                absent: { // Red square or similar
                                     border: '2px solid hsl(var(--destructive))',
                                     backgroundColor: 'hsl(var(--destructive))',
                                      color: 'hsl(var(--destructive-foreground))',
                                     borderRadius: '0%', // Square

                                }
                           }}
                       />
                     )}
                 </div>

            </CardContent>
          </Card>
        </div>

        {/* Right side: Attendance Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
               <CardTitle>Attendance Details {selectedDate ? `for ${format(selectedDate, 'PPP')}`: ''}</CardTitle>
               <CardDescription>
                 {selectedDate ? `Showing records for the selected date ${selectedEmployee !== 'all' ? `and employee ${selectedEmployee}` : ''}.` : 'Select a date from the calendar to see details.'}
               </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                  </div>
              ) : !selectedDate ? (
                  <p className="text-muted-foreground text-center py-10">Select a date to view records.</p>
              ): selectedDateRecords.length === 0 ? (
                  <p className="text-muted-foreground text-center py-10">No attendance records found for this date {selectedEmployee !== 'all' ? `for ${selectedEmployee}` : ''}.</p>
              ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                     {selectedDateRecords.map(record => (
                       <div key={record.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                             {selectedEmployee === 'all' && <span className="font-medium text-sm">{record.employeeId}</span>}
                             <div className="flex items-center gap-2 text-sm">
                                 <span>In: <span className="font-mono">{formatTime(record.inTime)}</span></span>
                                 <span>Out: <span className="font-mono">{formatTime(record.outTime)}</span></span>
                                 <span>Dur: <span className="font-mono">{calculateDuration(record.inTime, record.outTime)}</span></span>
                             </div>
                          </div>
                          <div className="ml-auto pl-4">
                              {getStatusBadge(record.inTime, record.outTime)}
                          </div>
                       </div>
                     ))}
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}


<<<<<<< HEAD


=======
>>>>>>> 6b1a0c8 (Your commit message)
