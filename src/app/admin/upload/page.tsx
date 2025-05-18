<<<<<<< HEAD

=======
>>>>>>> 573bb45a (Initial project push)
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
<<<<<<< HEAD
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import type { Lead } from "@/types/lead";
import { setUploadedLeads } from "@/lib/mock-data"; // Import the new function

// Helper to map Excel column names to Lead properties
const mapRowToLead = (row: any): Partial<Lead> => {
  const lead: Partial<Lead> = {};
  const normalizedRow: { [key: string]: any } = {};
  for (const key in row) {
    normalizedRow[key.trim().toLowerCase()] = row[key];
  }

  lead.id = normalizedRow['opportunity id'] || normalizedRow['id'] || Date.now(); 
  lead.name = normalizedRow['client name'] || normalizedRow['name'];
  lead.phone = String(normalizedRow['mobile number'] || normalizedRow['phone'] || '');
  lead.company = normalizedRow['company'];
  lead.email = normalizedRow['email'];
  lead.source = normalizedRow['source'];
  lead.assignedTo = normalizedRow['calling sm'] || normalizedRow['assigned to'] || normalizedRow['assignedto'];
  lead.location = normalizedRow['location'];
  lead.remark = normalizedRow['remark'];
  lead.callDate = normalizedRow['call date'] || normalizedRow['calldate'];
  lead.callBookedLost = normalizedRow['call booked/lost'] || normalizedRow['callbookedlost'];
  lead.callStatus = normalizedRow['call status'] || normalizedRow['callstatus'];
  lead.callOutcome = normalizedRow['call outcome'] || normalizedRow['calloutcome'];
  lead.nadDate = normalizedRow['nad'] || normalizedRow['next action date'] || normalizedRow['naddate'];
  lead.nadBookedLost = normalizedRow['nad booked/lost'] || normalizedRow['nadbookedlost'];
  lead.leadStatus = normalizedRow['lead status'] || normalizedRow['leadstatus'];
  lead.leadResult = normalizedRow['lead result'] || normalizedRow['leadresult'];
  lead.uploadDate = normalizedRow['upload date'] || normalizedRow['uploaddate'];

  return Object.fromEntries(Object.entries(lead).filter(([_, v]) => v !== undefined)) as Partial<Lead>;
};


async function processAndStoreLeads(file: File): Promise<{ success: boolean; message: string; leadCount: number }> {
  console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
    return { success: false, message: "Invalid file type. Please upload an .xlsx, .xls, or .csv file.", leadCount: 0 };
  }
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
     return { success: false, message: "File size exceeds 10MB limit.", leadCount: 0 };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) {
          throw new Error("Could not read file buffer.");
        }
        const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true }); 
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null }); 

        if (!jsonData || jsonData.length === 0) {
          resolve({ success: false, message: "The Excel sheet is empty or could not be read.", leadCount: 0 });
          return;
        }

        const parsedLeads: Partial<Lead>[] = jsonData.map(row => mapRowToLead(row as any));
        const validLeads = parsedLeads.filter(lead => lead.name && lead.phone);

        setUploadedLeads(validLeads); 

        resolve({ success: true, message: `Successfully processed ${validLeads.length} leads from "${file.name}".`, leadCount: validLeads.length });
      } catch (error) {
        console.error("Error processing Excel file:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during processing.";
        resolve({ success: false, message: `Error processing file: ${errorMessage}`, leadCount: 0 });
      }
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      resolve({ success: false, message: "Error reading file.", leadCount: 0 });
    };
    reader.readAsArrayBuffer(file);
  });
=======
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock upload function (replace with actual API call and file processing logic)
async function uploadLeadsApi(file: File): Promise<{ success: boolean; message: string }> {
  console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload/processing time

  // Basic validation example (add more robust checks)
  if (!file.name.endsWith('.xlsx')) {
    return { success: false, message: "Invalid file type. Please upload an .xlsx file." };
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB limit example
     return { success: false, message: "File size exceeds 5MB limit." };
  }

  // In a real app:
  // 1. Send the file to the backend (e.g., using FormData)
  // const formData = new FormData();
  // formData.append('leadFile', file);
  // const response = await fetch('/api/leads/upload', { method: 'POST', body: formData });
  // 2. Backend (PHP) processes the Excel file (using a library like PHPSpreadsheet)
  // 3. Validate data, map columns, insert into MySQL database
  // 4. Return success/error response

  return { success: true, message: `File "${file.name}" uploaded successfully. Leads are being processed.` };
>>>>>>> 573bb45a (Initial project push)
}

export default function UploadLeadsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

<<<<<<< HEAD
   const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
=======
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
>>>>>>> 573bb45a (Initial project push)
     if (event.target.files && event.target.files.length > 0) {
       setSelectedFile(event.target.files[0]);
     } else {
       setSelectedFile(null);
     }
<<<<<<< HEAD
   }, []);

   const handleUpload = useCallback(async () => {
=======
   };

   const handleUpload = async () => {
>>>>>>> 573bb45a (Initial project push)
     if (!selectedFile) {
       toast({ variant: "destructive", title: "No File Selected", description: "Please choose an Excel file to upload." });
       return;
     }

     setIsLoading(true);
     try {
<<<<<<< HEAD
        const result = await processAndStoreLeads(selectedFile);
       if (result.success) {
         toast({ 
           title: "Upload Successful", 
           description: `${result.message} Please navigate to the dashboard/refresh to see the updated leads.`,
           duration: 7000, 
          });
         setSelectedFile(null); 
=======
        const result = await uploadLeadsApi(selectedFile);
       if (result.success) {
         toast({ title: "Upload Started", description: result.message });
         setSelectedFile(null); // Clear selection after successful start
         // Optionally clear the input field value if needed
>>>>>>> 573bb45a (Initial project push)
         const fileInput = document.getElementById('lead-file-upload') as HTMLInputElement;
         if (fileInput) fileInput.value = '';
       } else {
         toast({ variant: "destructive", title: "Upload Failed", description: result.message });
       }
     } catch (error) {
       console.error("Upload error:", error);
       toast({ variant: "destructive", title: "Upload Error", description: "An unexpected error occurred during upload." });
     } finally {
       setIsLoading(false);
     }
<<<<<<< HEAD
   }, [selectedFile, toast]); // processAndStoreLeads is stable
=======
   };
>>>>>>> 573bb45a (Initial project push)

  return (
    <AppLayout userRole="admin">
       <h1 className="text-2xl font-semibold text-primary mb-6">Upload Leads</h1>
        <Card>
         <CardHeader>
<<<<<<< HEAD
           <CardTitle>Upload Excel File (.xlsx, .xls, .csv)</CardTitle>
           <CardDescription>
             Select an Excel file containing lead data. Common columns like 'Client Name', 'Mobile Number', 'Source', etc., will be mapped.
=======
           <CardTitle>Upload Excel File (.xlsx)</CardTitle>
           <CardDescription>
             Select an Excel file containing lead data. Ensure the columns match the required format.
             (Required columns: Name, Phone. Optional: Company, Email, Location, Source, etc.)
>>>>>>> 573bb45a (Initial project push)
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
             <Label htmlFor="lead-file-upload">Excel File</Label>
             <Input
                id="lead-file-upload"
                type="file"
<<<<<<< HEAD
                accept=".xlsx, .xls, .csv" 
=======
                accept=".xlsx" // Accept only .xlsx files
>>>>>>> 573bb45a (Initial project push)
                onChange={handleFileChange}
                disabled={isLoading}
             />
            </div>

            {selectedFile && (
             <p className="text-sm text-muted-foreground">
               Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
             </p>
            )}

            <Button onClick={handleUpload} disabled={isLoading || !selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
<<<<<<< HEAD
              {isLoading ? "Processing..." : "Upload and Process File"}
            </Button>
         </CardContent>
       </Card>
=======
              {isLoading ? "Uploading..." : "Upload File"}
            </Button>
         </CardContent>
       </Card>

       {/* Optional: Add section for data mapping configuration if needed */}
        {/* <Card className="mt-6">
         <CardHeader>
            <CardTitle>Column Mapping (Optional)</CardTitle>
           <CardDescription>Define how columns in your Excel file map to Lead fields.</CardDescription>
         </CardHeader>
         <CardContent>
           <p className="text-muted-foreground">Data mapping UI would go here.</p>
         </CardContent>
       </Card> */}
>>>>>>> 573bb45a (Initial project push)
    </AppLayout>
  );
}
