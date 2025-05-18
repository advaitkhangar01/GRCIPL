
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { format, parseISO, isValid as isValidDate, parse } from 'date-fns';
import type { AttendanceRecord } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save } from "lucide-react";
import { fetchEmployeeAttendance, saveAttendanceRecord } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

import { format, parseISO, isValid as isValidDate, startOfDay, endOfDay, isWithinInterval, parse } from 'date-fns'; // Import parse
import type { AttendanceRecord } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save } from "lucide-react";
import { fetchEmployeeAttendance, saveAttendanceRecord } from "@/lib/mock-data"; // Import mock functions
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton


export default function EmployeeAttendancePage() {
  const [employeeId, setEmployeeId] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecord[]>([]);
  const [currentRecord, setCurrentRecord] = React.useState<Partial<AttendanceRecord> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();
  const userRole = "employee";


  React.useEffect(() => {

  // Effect to get employee ID from localStorage
  React.useEffect(() => {
    // Check if window is defined (runs only on client)

    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setEmployeeId(storedUserId);
      } else {
        console.error("Employee ID not found in localStorage.");
        toast({ variant: "destructive", title: "Authentication Error", description: "Could not identify user." });

        setIsLoading(false);
      }
    }
  }, [toast]);

  const loadAttendance = React.useCallback(async () => {
    if (!employeeId) {
        setIsLoading(false); 
        return;
    }

        setIsLoading(false); // Stop loading if no user ID
      }
    } else {
        // Handle server-side case or if window is not available yet
        setIsLoading(false); // Avoid showing loader indefinitely on server
    }
  }, [toast]); // Add toast dependency

  // Effect to load attendance data when employeeId is set
  const loadAttendance = React.useCallback(async () => {
    if (!employeeId) return;

    setIsLoading(true);
    try {
      const data = await fetchEmployeeAttendance(employeeId);
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Failed to load attendance data:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load attendance records." });
    } finally {
      setIsLoading(false);
    }

  }, [employeeId, toast]); // fetchEmployeeAttendance is stable

  }, [employeeId, toast]);


  React.useEffect(() => {
    if (employeeId) {
      loadAttendance();
    }
  }, [employeeId, loadAttendance]);



  // Effect to update the form when the selected date or records change

  React.useEffect(() => {
    if (!selectedDate) {
      setCurrentRecord(null);
      return;
    }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const recordForDate = attendanceRecords.find(r => r.date === dateStr);

    if (recordForDate) {
      setCurrentRecord({
        employeeId: recordForDate.employeeId,
        date: recordForDate.date,

        inTime: recordForDate.inTime || '',
        outTime: recordForDate.outTime || '',
      });
    } else {

        inTime: recordForDate.inTime || '', // Use empty string for input binding if null
        outTime: recordForDate.outTime || '', // Use empty string for input binding if null
      });
    } else {
      // No record exists, initialize a new one for the selected date
      // Ensure employeeId is set before creating a new record shell

       if (employeeId) {
           setCurrentRecord({
             employeeId: employeeId,
             date: dateStr,
             inTime: '',
             outTime: '',
           });
        } else {

            setCurrentRecord(null);
        }
    }
  }, [selectedDate, attendanceRecords, employeeId]);

  const handleDateSelect = React.useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  const handleTimeChange = React.useCallback((field: 'inTime' | 'outTime', value: string) => {
    setCurrentRecord(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const isValidTimeFormat = (time: string | null | undefined): boolean => {
     if (!time) return true;
     return /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(time);
  };

  const handleSave = React.useCallback(async () => {

            setCurrentRecord(null); // Don't create a shell if no employeeId
        }
    }
  }, [selectedDate, attendanceRecords, employeeId]); // Add employeeId dependency

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (field: 'inTime' | 'outTime', value: string) => {
    setCurrentRecord(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Validate time format (HH:MM)
  const isValidTimeFormat = (time: string | null | undefined): boolean => {
     if (!time) return true; // Null or empty is considered valid (means not set)
     return /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(time);
  };

  const handleSave = async () => {

     if (!currentRecord || !employeeId || !currentRecord.date) {
       toast({ variant: "destructive", title: "Error", description: "Cannot save attendance without required information." });
       return;
     }


     // Validate times before saving

      if (!isValidTimeFormat(currentRecord.inTime) || !isValidTimeFormat(currentRecord.outTime)) {
           toast({ variant: "destructive", title: "Invalid Time Format", description: "Please use HH:MM format for time (e.g., 09:30)." });
           return;
      }



      if (currentRecord.inTime && currentRecord.outTime) {
          const inTimeDate = parse(`1970-01-01T${currentRecord.inTime}:00`, "yyyy-MM-dd'T'HH:mm:ss", new Date());
          const outTimeDate = parse(`1970-01-01T${currentRecord.outTime}:00`, "yyyy-MM-dd'T'HH:mm:ss", new Date());
          if (isValidDate(inTimeDate) && isValidDate(outTimeDate) && outTimeDate <= inTimeDate) {
               toast({ variant: "destructive", title: "Invalid Time Entry", description: "Out time must be after in time." });
               return;
          }
      }


     setIsSaving(true);
     try {


     setIsSaving(true);
     try {
       // Ensure we pass null if the time string is empty

       const dataToSave: Omit<AttendanceRecord, 'id' | 'lastUpdated'> = {
         employeeId: employeeId,
         date: currentRecord.date,
         inTime: currentRecord.inTime || null,
         outTime: currentRecord.outTime || null,
       };

       const result = await saveAttendanceRecord(dataToSave);
       if (result.success && result.record) {
         toast({ title: "Attendance Saved", description: `Attendance for ${format(parseISO(result.record.date), 'PPP')} saved.` });


         // Update local state immediately

         setAttendanceRecords(prev => {
           const index = prev.findIndex(r => r.id === result.record!.id);
           if (index !== -1) {
             const updated = [...prev];
             updated[index] = result.record!;
             return updated;
           } else {
             return [...prev, result.record!].sort((a, b) => b.date.localeCompare(a.date));
           }
         });
       } else {
         toast({ variant: "destructive", title: "Save Failed", description: "Could not save attendance record." });
       }
     } catch (error) {
       console.error("Failed to save attendance:", error);
       toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
     } finally {
       setIsSaving(false);
     }

  }, [currentRecord, employeeId, toast]); // saveAttendanceRecord is stable

  const hasAttendanceRecord = React.useCallback((date: Date): boolean => {
      if (!date || !isValidDate(date)) return false;
      const dateStr = format(date, 'yyyy-MM-dd');
      return attendanceRecords.some(record => record.date === dateStr && (record.inTime || record.outTime));
  }, [attendanceRecords]);

  if (isLoading && !employeeId) { 
    return (
      <AppLayout userRole={userRole}>
        <h1 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">My Attendance</h1>
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Card>
                <CardContent className="p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
                    <Skeleton className="w-full lg:w-[280px] h-[300px]" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-1/3 ml-auto" />
                    </div>
                </CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  if (!employeeId && !isLoading) { 
      return (
          <AppLayout userRole={userRole}>
              <h1 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">My Attendance</h1>
              <p className="text-destructive text-center mt-10">Could not load attendance. User ID not found.</p>
          </AppLayout>
      );
  }

  };

  // Function to check if a date has an entry (used by Calendar)
  const hasAttendanceRecord = (date: Date): boolean => {
      if (!date || !isValidDate(date)) return false; // Add check for valid date
      const dateStr = format(date, 'yyyy-MM-dd');
      return attendanceRecords.some(record => record.date === dateStr && (record.inTime || record.outTime));
  };



  return (
    <AppLayout userRole={userRole}>
      <h1 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">My Attendance</h1>

        <Card>
          <CardContent className="p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6">

      {isLoading && !employeeId ? ( // Show loading skeleton only if loading and no employeeId yet
          <div className="space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <Card>
                  <CardContent className="p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6"> {/* Adjusted padding */}
                      <Skeleton className="w-full lg:w-[280px] h-[300px]" /> {/* Adjusted width */}
                      <div className="flex-1 space-y-4">
                          <Skeleton className="h-6 w-1/2" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-1/3 ml-auto" />
                      </div>
                  </CardContent>
              </Card>
          </div>
      ) : !employeeId ? (
          <p className="text-destructive text-center mt-10">Could not load attendance. User ID not found.</p>
      ) : (
        <Card>
           {/* Adjusted layout for responsiveness */}
          <CardContent className="p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Calendar View - Allow shrinking/centering on smaller screens */}

            <div className="flex justify-center lg:justify-start w-full lg:w-auto">
               <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}

                  className="rounded-md border w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0"
                  disabled={(date) => date > new Date()}
                  modifiers={{ recorded: hasAttendanceRecord }}
                  modifiersStyles={{
                      recorded: {

                  className="rounded-md border w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0" // Added max-width and centering
                  disabled={(date) => date > new Date()} // Disable future dates
                  modifiers={{
                       recorded: hasAttendanceRecord, // Apply 'recorded' modifier
                  }}
                  modifiersStyles={{
                      recorded: { // Style for dates with records

                          fontWeight: 'bold',
                          border: '2px solid hsl(var(--primary))',
                          borderRadius: '50%',
                      },
                  }}
              />
            </div>



            {/* Attendance Form */}

            <div className="flex-1 space-y-4">
              <h2 className="text-lg font-semibold text-primary">
                Record for: {selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}
              </h2>

              {isLoading && !currentRecord ? (
                <div className="space-y-4 pt-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full max-w-xs" />
                    <Skeleton className="h-6 w-1/4 mt-2" />
                    <Skeleton className="h-10 w-full max-w-xs" />
                    <Skeleton className="h-10 w-1/3 ml-auto mt-4 max-w-[150px]" />

              {isLoading && !currentRecord ? ( // Show loader if data is loading for the selected date
                <div className="space-y-4 pt-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full max-w-xs" /> {/* Max width for inputs */}
                    <Skeleton className="h-6 w-1/4 mt-2" />
                    <Skeleton className="h-10 w-full max-w-xs" />
                    <Skeleton className="h-10 w-1/3 ml-auto mt-4 max-w-[150px]" /> {/* Max width for button */}

                </div>
              ) : !selectedDate ? (
                <p className="text-muted-foreground pt-2">Please select a date from the calendar.</p>
              ) : !currentRecord ? (

                 <p className="text-muted-foreground pt-2">Loading record...</p>
              ): (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="inTime" className="flex items-center mb-1 text-sm">

                 <p className="text-muted-foreground pt-2">Loading record...</p> // Show loading if currentRecord is null temporarily
              ): (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="inTime" className="flex items-center mb-1 text-sm"> {/* Smaller label */}

                       <Clock className="h-4 w-4 mr-1" /> In Time (HH:MM)
                    </Label>
                    <Input
                      id="inTime"

                      type="time"
                      value={currentRecord.inTime || ''}
                      onChange={(e) => handleTimeChange('inTime', e.target.value)}
                      disabled={isSaving}
                      className="w-full max-w-xs"
                      type="time" // Use time input type
                      value={currentRecord.inTime || ''}
                      onChange={(e) => handleTimeChange('inTime', e.target.value)}
                      disabled={isSaving}
                      className="w-full max-w-xs" // Limit width

                      aria-label="In Time"
                    />
                     {!isValidTimeFormat(currentRecord.inTime) && currentRecord.inTime && (
                         <p className="text-sm text-destructive mt-1">Invalid format. Use HH:MM.</p>
                     )}
                  </div>
                  <div>

                    <Label htmlFor="outTime" className="flex items-center mb-1 text-sm">

                    <Label htmlFor="outTime" className="flex items-center mb-1 text-sm"> {/* Smaller label */}

                      <Clock className="h-4 w-4 mr-1" /> Out Time (HH:MM)
                    </Label>
                    <Input
                      id="outTime"

                      type="time"
                      value={currentRecord.outTime || ''}
                      onChange={(e) => handleTimeChange('outTime', e.target.value)}
                      disabled={isSaving || !currentRecord.inTime}
                      className="w-full max-w-xs"

                      type="time" // Use time input type
                      value={currentRecord.outTime || ''}
                      onChange={(e) => handleTimeChange('outTime', e.target.value)}
                      disabled={isSaving || !currentRecord.inTime} // Disable if no in-time or saving
                      className="w-full max-w-xs" // Limit width

                      aria-label="Out Time"
                    />
                     {!isValidTimeFormat(currentRecord.outTime) && currentRecord.outTime && (
                         <p className="text-sm text-destructive mt-1">Invalid format. Use HH:MM.</p>
                     )}
                     {!currentRecord.inTime && currentRecord.outTime && (
                          <p className="text-sm text-destructive mt-1">Cannot set Out time before In time.</p>
                     )}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} disabled={isSaving || isLoading || !selectedDate}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save Attendance'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      )}

    </AppLayout>
  );
}
