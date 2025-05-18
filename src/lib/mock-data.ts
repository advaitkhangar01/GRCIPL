
<<<<<<< HEAD
import type { Lead, CallStatus, CallOutcome, LeadStatus, LeadResult } from '@/types/lead';
import type { AttendanceRecord } from '@/types/attendance';
import { format, subDays, addDays, parseISO, isValid as isValidDate, parse } from 'date-fns';

// Global in-memory store for leads - initialized as empty
export let allLeads: Lead[] = [];

// --- Lead Management Functions ---

// Function to parse dates from various formats that might come from Excel
const parseDateSafe = (dateInput: any): string | null => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isValidDate(dateInput) ? format(dateInput, 'yyyy-MM-dd') : null;
  }
  if (typeof dateInput === 'string') {
    try {
      // Attempt to parse common date string formats
      const parsed = parseISO(dateInput); // Handles ISO strings like "2024-10-20T00:00:00.000Z"
      if (isValidDate(parsed)) return format(parsed, 'yyyy-MM-dd');

      // Try other common formats, e.g., "MM/DD/YYYY" or "DD-MM-YYYY"
      // This part might need more robust parsing based on expected Excel formats
      let date = parse(dateInput, 'MM/dd/yyyy', new Date());
      if (isValidDate(date)) return format(date, 'yyyy-MM-dd');
      date = parse(dateInput, 'dd-MM-yyyy', new Date());
      if (isValidDate(date)) return format(date, 'yyyy-MM-dd');
      date = parse(dateInput, 'yyyy-MM-dd', new Date());
      if (isValidDate(date)) return format(date, 'yyyy-MM-dd');

    } catch (e) { /* ignore parsing errors, return null below */ }
  }
  if (typeof dateInput === 'number') {
    // Excel date serial number (days since 1900-01-00)
    // This conversion is approximate and might need adjustment
    try {
      const excelEpoch = new Date(1899, 11, 30); // Excel epoch starts from 30 Dec 1899 for serial 0.
      const jsDate = new Date(excelEpoch.getTime() + dateInput * 24 * 60 * 60 * 1000);
      if (isValidDate(jsDate)) return format(jsDate, 'yyyy-MM-dd');
    } catch (e) { /* ignore errors */ }
  }
  return null; // Fallback if no valid date found
};


// Function to set/replace all leads, typically after an upload
export function setUploadedLeads(newLeads: Partial<Lead>[]): void {
  const currentDateIso = new Date().toISOString();
  const currentDayIso = format(new Date(), 'yyyy-MM-dd');

  allLeads = newLeads.map((lead, index) => ({
    id: String(lead.id || `generated-${Date.now()}-${index}`), // Ensure ID is a string
    name: lead.name || "Unknown Name",
    phone: String(lead.phone || ""), // Ensure phone is a string
    company: lead.company,
    email: lead.email,
    source: lead.source,
    assignedTo: lead.assignedTo,
    location: lead.location,
    remark: lead.remark,
    callDate: parseDateSafe(lead.callDate),
    callTime: lead.callTime,
    callBookedLost: lead.callBookedLost,
    callStatus: lead.callStatus,
    callOutcome: lead.callOutcome,
    nadDate: parseDateSafe(lead.nadDate),
    nadBookedLost: lead.nadBookedLost,
    leadStatus: lead.leadStatus,
    leadResult: lead.leadResult,
    uploadDate: parseDateSafe(lead.uploadDate) || currentDayIso,
    lastUpdated: currentDateIso,
  }));
  console.log("Mock data 'allLeads' updated with uploaded leads:", allLeads);
}

// Function to update a single lead
export async function updateMockLead(updatedLeadData: Partial<Lead>): Promise<{ success: boolean; lead?: Lead; message?: string }> {
  console.log("Attempting to update lead in mock data:", updatedLeadData);
  const leadIndex = allLeads.findIndex(l => l.id === updatedLeadData.id);
  if (leadIndex !== -1) {
    // Ensure 'assignedTo' is set to null if it's an empty string or "Unassigned"
    if (updatedLeadData.assignedTo === "" || updatedLeadData.assignedTo === "Unassigned") {
        updatedLeadData.assignedTo = undefined; // Use undefined to truly unassign, or null if your type allows
    }
    allLeads[leadIndex] = { ...allLeads[leadIndex], ...updatedLeadData, lastUpdated: new Date().toISOString() } as Lead;
    console.log("Lead updated:", allLeads[leadIndex]);
    return { success: true, lead: allLeads[leadIndex] };
  }
  console.log("Lead not found for update:", updatedLeadData.id);
  return { success: false, message: "Lead not found for update." };
}

// Function to assign leads
export async function assignMockLeads(leadIds: (string|number)[], employeeId: string): Promise<{ success: boolean }> {
  console.log(`Assigning leads ${leadIds.join(', ')} to ${employeeId} in mock data`);
  let changesMade = false;
  leadIds.forEach(id => {
    const leadIndex = allLeads.findIndex(l => String(l.id) === String(id));
    if (leadIndex !== -1) {
      allLeads[leadIndex].assignedTo = employeeId === "Unassigned" ? undefined : employeeId;
      allLeads[leadIndex].lastUpdated = new Date().toISOString();
      changesMade = true;
    }
  });
  return { success: changesMade };
}

// Function to delete a lead
export async function deleteMockLead(leadId: string | number): Promise<{ success: boolean }> {
  console.log("Deleting lead from mock data:", leadId);
  const initialLength = allLeads.length;
  allLeads = allLeads.filter(l => String(l.id) !== String(leadId));
  const success = allLeads.length < initialLength;
  if (success) console.log("Lead deleted.");
  else console.log("Lead not found for deletion.");
  return { success };
}

// Fetch functions now use the global `allLeads`
export async function fetchAdminLeads(): Promise<Lead[]> {
  console.log("Fetching admin leads from mock data (allLeads)...");
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...allLeads]; // Return a copy
}

export async function fetchEmployeeLeads(employeeId: string): Promise<Lead[]> {
  console.log(`Fetching leads for employee ${employeeId} from mock data (allLeads)...`);
  await new Promise(resolve => setTimeout(resolve, 100));
  return allLeads.filter(lead => lead.assignedTo?.toLowerCase() === employeeId.toLowerCase());
}

export async function fetchProspectLeads(): Promise<Lead[]> {
  console.log("Fetching prospect leads from mock data (allLeads)...");
  await new Promise(resolve => setTimeout(resolve, 100));
  return allLeads.filter(lead =>
       lead.callOutcome === "Prospect" ||
       ["Hot", "Warm", "Cold", "Very Cold"].includes(lead.leadStatus || "")
  );
}

export async function fetchEmployeeProspectLeads(employeeId: string): Promise<Lead[]> {
    console.log(`Fetching prospect leads for employee ${employeeId} from mock data...`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return allLeads.filter(lead =>
        lead.assignedTo?.toLowerCase() === employeeId.toLowerCase() &&
        (lead.callOutcome === "Prospect" || ["Hot", "Warm", "Cold", "Very Cold"].includes(lead.leadStatus || ""))
    );
}

export async function fetchWonLeads(): Promise<Lead[]> {
  console.log("Fetching won leads from mock data (allLeads)...");
  await new Promise(resolve => setTimeout(resolve, 100));
  return allLeads.filter(lead => lead.callOutcome === "Won by GRC" || lead.leadStatus === "Booked");
}

export async function fetchUnassignedLeads(): Promise<Lead[]> {
  console.log("Fetching unassigned leads from mock data (allLeads)...");
  await new Promise(resolve => setTimeout(resolve, 100));
  return allLeads.filter(lead => !lead.assignedTo || lead.assignedTo === "Unassigned");
}

export async function fetchEmployees(): Promise<string[]> {
   console.log("Fetching employees from mock data (allLeads)...");
   await new Promise(resolve => setTimeout(resolve, 100));
   const employees = [...new Set(allLeads.map(lead => lead.assignedTo).filter(Boolean) as string[])];
   return employees;
}


// --- Attendance Mock Data (remains largely unchanged as it's separate) ---
let mockAttendanceRecords: AttendanceRecord[] = [];
const employeeIdsForAttendance = ["pooja", "aditya"]; // Ensure these match your login credentials if needed

// Function to initialize or clear attendance records
export function initializeAttendance() {
    const today = new Date();
    const records: AttendanceRecord[] = [];
    // Example: Generate some recent mock attendance for known employees
    // You can adjust this logic or clear it entirely
    for (let i = 0; i < 30; i++) { // Generate for last 30 days
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');

        // Skip weekends or add some randomness
        if (date.getDay() === 0 || date.getDay() === 6 || Math.random() < 0.2) continue;

        for (const empId of employeeIdsForAttendance) {
            // Random in/out times or present/absent logic
            const present = Math.random() > 0.1; // 90% chance of being present
            let inTime: string | null = null;
            let outTime: string | null = null;

            if (present) {
                const inHour = Math.floor(Math.random() * 2) + 9; // 9-10 AM
                const inMinute = Math.floor(Math.random() * 60);
                inTime = `${String(inHour).padStart(2, '0')}:${String(inMinute).padStart(2, '0')}`;

                if (Math.random() > 0.15) { // 85% chance of having out time if in time exists
                    const outHour = Math.floor(Math.random() * 2) + 17; // 5-6 PM
                    const outMinute = Math.floor(Math.random() * 60);
                    outTime = `${String(outHour).padStart(2, '0')}:${String(outMinute).padStart(2, '0')}`;
                }
            }

            records.push({
                id: `${empId}-${dateStr}`,
                employeeId: empId,
                date: dateStr,
                inTime: inTime,
                outTime: outTime,
                lastUpdated: subDays(new Date(), i).toISOString(),
            });
        }
    }
    mockAttendanceRecords = records;
    console.log("Mock attendance records initialized/updated.");
}

// Call initializeAttendance on module load to set up initial mock data (or clear it by making it empty)
initializeAttendance();


export async function fetchEmployeeAttendance(employeeId: string): Promise<AttendanceRecord[]> {
  console.log(`Fetching attendance for employee: ${employeeId}`);
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockAttendanceRecords.filter(record => record.employeeId === employeeId);
}

export async function fetchAllAttendance(): Promise<AttendanceRecord[]> {
  console.log("Fetching all attendance records for admin...");
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...mockAttendanceRecords];
}

export async function saveAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'lastUpdated'>): Promise<{ success: boolean; record?: AttendanceRecord }> {
   console.log("Saving attendance record:", record);
   await new Promise(resolve => setTimeout(resolve, 100));
   const recordId = `${record.employeeId}-${record.date}`;
   const existingIndex = mockAttendanceRecords.findIndex(r => r.id === recordId);
   const updatedRecord: AttendanceRecord = { ...record, id: recordId, lastUpdated: new Date().toISOString() };
   if (existingIndex !== -1) mockAttendanceRecords[existingIndex] = updatedRecord;
   else mockAttendanceRecords.push(updatedRecord);
   mockAttendanceRecords.sort((a, b) => b.date.localeCompare(a.date));
   return { success: true, record: updatedRecord };
}
=======
import type { Lead, CallStatus, CallOutcome, LeadStatus, LeadResult } from '@/types/lead'; // Import new types
import type { AttendanceRecord } from '@/types/attendance'; // Import AttendanceRecord type
import { format, subDays, addDays, parse, isValid as isValidDate } from 'date-fns';

// Original Excel data is kept here for reference but not used for lead generation anymore
const excelData = [
    // { Source: 'GRC-Test', 'Opportunity Id': 'GRC1.00001', 'Client Name': 'Test GRC', 'Mobile Number': '9999999999', 'Calling SM': 'Pooja' },
    // ... (rest of the excel data commented out or removed for brevity)
];

const possibleCallStatuses: CallStatus[] = ["Connected", "Not Connected", null];
const possibleCallOutcomes: CallOutcome[] = ["Prospect", "Call Back", "Not Interested", "Ringing", "Call Disconnected", "Won by GRC", null];
const possibleBookedLost: Array<'Booked' | 'Lost' | null> = ["Booked", "Lost", null];
const possibleLocations = ["Mumbai", "Pune", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Ahmedabad", "Surat", "Jaipur"];
const possibleRemarks = [
    "Interested in 2BHK flat.", "Looking for investment property.", "Budget around 1 Cr.",
    "Needs property near station.", "Follow up next week.", "Not answering calls.",
    "Wants ready possession.", "Asked for brochure.", "Site visit scheduled.",
    "Currently out of station.", null, "Decision maker is abroad.", "Looking for loan options.",
    "Wife needs to see the property.", "Needs more options.", "Price slightly high."
];
const possibleLeadStatuses: LeadStatus[] = ["Hot", "Warm", "Cold", "Very Cold", "Lost", "Booked", null];
const possibleLeadResults: LeadResult[] = ["VDNB", "Visit Proposed", "Visit Confirmed", "Visit not Done", "Booked", null];


const getRandomElement = <T>(arr: Array<T>): T => {
    if (arr.length === 0) return null as T; // Handle empty arrays gracefully
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
};

const getRandomDate = (startOffset: number, endOffset: number): string | null => {
    const today = new Date();
    // Ensure startOffset is less than endOffset
    const start = Math.min(startOffset, endOffset);
    const end = Math.max(startOffset, endOffset);

    const randomDays = Math.floor(Math.random() * (end - start + 1)) + start;
    // Randomly return null sometimes
    if (Math.random() < 0.15) return null; // ~15% chance of being null
    return format(addDays(today, randomDays), 'yyyy-MM-dd');
};

const getRandomPastDate = (daysAgoMax: number): string => {
    const today = new Date();
    const randomDaysAgo = Math.floor(Math.random() * daysAgoMax) + 1; // 1 to daysAgoMax
    return format(subDays(today, randomDaysAgo), 'yyyy-MM-dd');
};


export const generateMockLeads = (): Lead[] => {
    // Return an empty array to clear all leads
    return [];

    // --- Original lead generation logic commented out ---
    /*
    return excelData.map((row, index): Lead => {
        // Use let instead of const for variables that might be reassigned
        let callDate = getRandomDate(-30, -1); // Call date in the last 30 days or null
        let callStatus: CallStatus = null;
        let callOutcome: CallOutcome = null;
        let callBookedLost: 'Booked' | 'Lost' | null = null;
        let nadDate: string | null = null;
        let nadBookedLost: 'Booked' | 'Lost' | null = null;

        // Prospect specific fields
        let leadStatus: LeadStatus = null;
        let leadResult: LeadResult = null;


        if (callDate) {
            callStatus = getRandomElement(possibleCallStatuses.filter(s => s!==null)); // If there's a call date, it's likely connected or not
            if (callStatus === "Connected") {
                callOutcome = getRandomElement(possibleCallOutcomes.filter(o => o !== null && o !== "Ringing")); // Connected implies an outcome other than Ringing
                if (callOutcome === "Prospect" || callOutcome === "Call Back") {
                    nadDate = getRandomDate(1, 15); // NAD within next 15 days
                    if (nadDate && Math.random() < 0.2) { // ~20% chance of NAD being booked/lost
                        nadBookedLost = getRandomElement(possibleBookedLost.filter(s=>s!==null));
                    }
                     // Assign lead status and result if it's a prospect or callback
                    leadStatus = getRandomElement(possibleLeadStatuses.filter(s => s !== 'Lost' && s !== 'Booked' && s !== null)); // Assign active statuses
                    if (leadStatus === 'Hot' || leadStatus === 'Warm') {
                        leadResult = getRandomElement(possibleLeadResults.filter(r => r !== 'Booked' && r !== null)); // Assign active results
                    } else {
                        leadResult = getRandomElement([null, "VDNB", "Visit Proposed"]); // Colder leads less likely to have advanced results
                    }

                } else if (callOutcome === "Won by GRC" || callOutcome === "Not Interested") {
                    callBookedLost = callOutcome === "Won by GRC" ? "Booked" : "Lost";
                    nadDate = null; // No NAD if won or lost
                    leadStatus = callOutcome === "Won by GRC" ? "Booked" : "Lost";
                    leadResult = callOutcome === "Won by GRC" ? "Booked" : null; // Result is Booked if won
                }
            } else { // Not Connected
                callOutcome = getRandomElement(["Ringing", "Call Disconnected", null]);
                if (callOutcome === "Ringing" && Math.random() < 0.5) {
                    nadDate = getRandomDate(1, 5); // Set NAD for ringing sometimes
                }
                 // Keep lead status/result null if not connected
                 leadStatus = null;
                 leadResult = null;
            }
        } else {
            // No call date yet
            callStatus = null;
            callOutcome = null;
             leadStatus = getRandomElement([null, "Cold", "Very Cold"]); // New leads are often cold initially
             leadResult = null;
            // Maybe set NAD if it's a fresh lead?
             if (Math.random() < 0.3) {
                 nadDate = getRandomDate(1, 7); // Schedule NAD for some new leads
             }
        }

        // Special handling for the first row to ensure it exists
        if (index === 0) {
            callDate = callDate || getRandomPastDate(5); // Ensure first row has a call date
            callStatus = callStatus || "Connected";
            callOutcome = callOutcome || "Prospect";
            leadStatus = leadStatus || "Warm"; // Make first one warm
            leadResult = leadResult || "Visit Proposed";
            nadDate = nadDate || getRandomDate(1,7);
        }
         // Ensure Booked/Lost consistency
         if (leadStatus === 'Booked') {
             leadResult = 'Booked';
             callOutcome = 'Won by GRC'; // Align call outcome
         } else if (leadStatus === 'Lost') {
             callOutcome = 'Not Interested'; // Align call outcome
             leadResult = null;
         }

        // Generate upload date further in the past
        const uploadDate = getRandomPastDate(Math.max(30, index + 1)); // Upload date between 30 days ago and further back


        return {
            id: row['Opportunity Id'], // Use Opportunity Id as unique ID
            name: row['Client Name'],
            phone: row['Mobile Number'].toString(),
            source: row.Source,
            assignedTo: row['Calling SM'],
            // Optional fields (randomly generated or null)
            company: Math.random() > 0.7 ? `Company ${index + 1}` : undefined,
            email: Math.random() > 0.6 ? `${row['Client Name'].toLowerCase().replace(/\s+/g, '.')}@example.com` : undefined,
            location: getRandomElement(possibleLocations),
            remark: getRandomElement(possibleRemarks),
            callDate: callDate,
            callStatus: callStatus,
            callOutcome: callOutcome,
            callBookedLost: callBookedLost,
            nadDate: nadDate,
            nadBookedLost: nadBookedLost,
            uploadDate: uploadDate, // Use generated past date
            lastUpdated: callDate ? format(new Date(callDate), "yyyy-MM-dd'T'HH:mm:ss'Z'") : format(new Date(uploadDate), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // Use call date or upload date as last updated initially
            // Add new fields
            leadStatus: leadStatus,
            leadResult: leadResult,
        };
    });
    */
};


// --- Attendance Mock Data ---

let mockAttendanceRecords: AttendanceRecord[] = [];
const employeeIds = ["pooja", "aditya"]; // List of employee IDs

// Function to generate mock attendance data for the last N days
const generateMockAttendance = (days: number) => {
  const today = new Date();
  const records: AttendanceRecord[] = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');

    // Simulate weekends (no records) or some days off
    if (date.getDay() === 0 || date.getDay() === 6 || Math.random() < 0.1) {
      continue; // Skip weekends and random days off
    }

    for (const empId of employeeIds) {
       // Simulate varied in/out times
       const inHour = Math.floor(Math.random() * 2) + 9; // 9 or 10 AM
       const inMinute = Math.floor(Math.random() * 60);
       const outHour = Math.floor(Math.random() * 2) + 18; // 6 or 7 PM
       const outMinute = Math.floor(Math.random() * 60);

        // Sometimes mark as absent (no in/out time) or only in-time
        let inTime: string | null = `${String(inHour).padStart(2, '0')}:${String(inMinute).padStart(2, '0')}`;
        let outTime: string | null = `${String(outHour).padStart(2, '0')}:${String(outMinute).padStart(2, '0')}`;

        const attendanceStatus = Math.random();
        if (attendanceStatus < 0.05) { // 5% chance of absent
           inTime = null;
           outTime = null;
        } else if (attendanceStatus < 0.15) { // 10% chance of only marking IN time (e.g., forgot to mark OUT)
            outTime = null;
            // Ensure inTime is not null if outTime is null but not fully absent
            if (!inTime) {
                 inTime = `${String(inHour).padStart(2, '0')}:${String(inMinute).padStart(2, '0')}`;
            }
        }


      records.push({
        id: `${empId}-${dateStr}`, // Unique ID based on employee and date
        employeeId: empId,
        date: dateStr,
        inTime: inTime,
        outTime: outTime,
        lastUpdated: subDays(new Date(), i).toISOString(), // Simulate update time close to the date
      });
    }
  }
  mockAttendanceRecords = records;
};

// Generate mock data for the last 60 days on initialization
generateMockAttendance(60);

// Mock function to fetch attendance records for a specific employee
export async function fetchEmployeeAttendance(employeeId: string): Promise<AttendanceRecord[]> {
  console.log(`Fetching attendance for employee: ${employeeId}`);
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
  return mockAttendanceRecords.filter(record => record.employeeId === employeeId);
}

// Mock function to fetch all attendance records (for admin)
export async function fetchAllAttendance(): Promise<AttendanceRecord[]> {
  console.log("Fetching all attendance records for admin...");
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay
  return [...mockAttendanceRecords]; // Return a copy
}


// Mock function to save or update an attendance record
export async function saveAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'lastUpdated'>): Promise<{ success: boolean; record?: AttendanceRecord }> {
   console.log("Saving attendance record:", record);
   await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

   const recordId = `${record.employeeId}-${record.date}`;
   const existingIndex = mockAttendanceRecords.findIndex(r => r.id === recordId);

   const updatedRecord: AttendanceRecord = {
     ...record,
     id: recordId,
     lastUpdated: new Date().toISOString(),
   };

   if (existingIndex !== -1) {
     // Update existing record
     mockAttendanceRecords[existingIndex] = updatedRecord;
   } else {
     // Add new record
     mockAttendanceRecords.push(updatedRecord);
     // Keep the array sorted by date descending (optional)
     mockAttendanceRecords.sort((a, b) => b.date.localeCompare(a.date));
   }

   return { success: true, record: updatedRecord };
}

>>>>>>> 573bb45a (Initial project push)
