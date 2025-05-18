
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { format, parseISO, isValid } from 'date-fns';
import type { UploadHistoryEntry } from "@/types/upload-history";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Mock function to fetch upload history (returns an empty array as per previous request)
async function fetchUploadHistory(): Promise<UploadHistoryEntry[]> {
  console.log("Fetching upload history (mock)...");
  await new Promise(resolve => setTimeout(resolve, 100));
  return [];
=======
import { format, parseISO, isValid } from 'date-fns'; // Import isValid
import type { UploadHistoryEntry } from "@/types/upload-history";
import { useToast } from "@/hooks/use-toast";

// Mock function to fetch upload history (replace with actual API call)
async function fetchUploadHistory(): Promise<UploadHistoryEntry[]> {
  console.log("Fetching upload history...");
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

  // In a real app, fetch from your backend API (e.g., /api/uploads/history)
  // The backend would query a dedicated table storing upload event details.
  return [
    { id: 1, fileName: "leads_september_batch_1.xlsx", uploadTimestamp: "2024-09-16T11:05:00Z", uploadedBy: "Admin User 1", leadCount: 150, status: "Completed" },
    { id: 2, fileName: "urgent_leads_q3.xlsx", uploadTimestamp: "2024-09-17T09:30:00Z", uploadedBy: "Admin User 2", leadCount: 25, status: "Completed" },
    { id: 3, fileName: "leads_with_errors.xlsx", uploadTimestamp: "2024-09-17T14:15:00Z", uploadedBy: "Admin User 1", leadCount: 50, status: "Failed", errorMessage: "Invalid phone number format in row 12." },
    { id: 4, fileName: "new_prospects_oct.xlsx", uploadTimestamp: "2024-10-01T10:00:00Z", uploadedBy: "Admin User 1", leadCount: 200, status: "Processing" },
    { id: 5, fileName: "another_batch.xlsx", uploadTimestamp: "2024-07-20T15:00:00Z", uploadedBy: "Admin User 3", leadCount: 100, status: "Completed" },
    // Add more mock entries
  ].map(entry => ({...entry, id: String(entry.id)})); // Ensure IDs are strings if needed
>>>>>>> 573bb45a (Initial project push)
}

// Helper to format date strings
const formatTimestamp = (timestamp: string | null | undefined): string => {
  if (!timestamp) return "N/A";
  try {
    const date = parseISO(timestamp);
    if (!isValid(date)) {
      throw new Error("Invalid date string passed to parseISO");
    }
<<<<<<< HEAD
    return format(date, 'PPpp');
=======
    return format(date, 'PPpp'); // Format like 'Sep 15, 2024, 11:05:00 AM'
>>>>>>> 573bb45a (Initial project push)
  } catch (e) {
    console.warn("Invalid Timestamp for formatting:", timestamp, e);
    return "Invalid Date";
  }
};

// Helper to get badge variant based on status
const getStatusVariant = (status: UploadHistoryEntry['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Completed':
<<<<<<< HEAD
      return 'default';
    case 'Processing':
      return 'outline';
    case 'Failed':
      return 'destructive';
=======
      return 'default'; // Use primary color for success
    case 'Processing':
      return 'outline'; // Use outline for in-progress
    case 'Failed':
      return 'destructive'; // Use destructive for failure
>>>>>>> 573bb45a (Initial project push)
    default:
      return 'secondary';
  }
};

export default function UploadHistoryPage() {
  const [history, setHistory] = React.useState<UploadHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

<<<<<<< HEAD
  const loadHistory = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUploadHistory();
      data.sort((a, b) => {
        try {
          const dateA = parseISO(a.uploadTimestamp);
          const dateB = parseISO(b.uploadTimestamp);
          if (!isValid(dateA) || !isValid(dateB)) return 0;
          return dateB.getTime() - dateA.getTime();
        } catch (e) {
          console.warn("Error parsing dates during sort:", a.uploadTimestamp, b.uploadTimestamp);
          return 0;
        }
      });
      setHistory(data);
    } catch (error) {
      console.error("Failed to load upload history:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load upload history data." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // fetchUploadHistory is stable

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const renderSkeleton = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/6" />
          <Skeleton className="h-5 w-1/12" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-1/6" />
        </div>
      ))}
    </div>
  );
=======
  React.useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUploadHistory();
        // Sort by timestamp descending (most recent first)
         data.sort((a, b) => {
            try {
                 const dateA = parseISO(a.uploadTimestamp);
                 const dateB = parseISO(b.uploadTimestamp);
                 if (!isValid(dateA) || !isValid(dateB)) return 0; // Handle invalid dates during sort
                 return dateB.getTime() - dateA.getTime();
            } catch (e) {
                 console.warn("Error parsing dates during sort:", a.uploadTimestamp, b.uploadTimestamp);
                 return 0; // Keep original order on error
            }
         });
        setHistory(data);
      } catch (error) {
        console.error("Failed to load upload history:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load upload history data." });
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [toast]);
>>>>>>> 573bb45a (Initial project push)

  return (
    <AppLayout userRole="admin">
      <h1 className="text-2xl font-semibold text-primary mb-6">Upload History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Past Lead Uploads</CardTitle>
<<<<<<< HEAD
          <CardDescription>Log of all lead files uploaded to the system (session-based).</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderSkeleton()
          ) : history.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">No upload history found for this session.</p>
=======
          <CardDescription>Log of all lead files uploaded to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading history...</p> // Replace with skeleton loader
          ) : history.length === 0 ? (
            <p className="text-muted-foreground">No upload history found.</p>
>>>>>>> 573bb45a (Initial project push)
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Upload Time</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead className="text-right">Lead Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
<<<<<<< HEAD
=======
                    // Add key prop here using entry.id
>>>>>>> 573bb45a (Initial project push)
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.fileName}</TableCell>
                      <TableCell>{formatTimestamp(entry.uploadTimestamp)}</TableCell>
                      <TableCell>{entry.uploadedBy}</TableCell>
                      <TableCell className="text-right">{entry.leadCount}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(entry.status)}>{entry.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{entry.errorMessage || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
