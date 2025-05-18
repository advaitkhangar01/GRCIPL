export type CallStatus = "Connected" | "Not Connected" | null;
export type CallOutcome = "Prospect" | "Call Back" | "Not Interested" | "Ringing" | "Call Disconnected" | "Won by GRC" | null;

// New types for Prospect-specific fields
export type LeadStatus = "Hot" | "Warm" | "Cold" | "Very Cold" | "Lost" | "Booked" | null;
export type LeadResult = "VDNB" | "Visit Proposed" | "Visit Confirmed" | "Visit not Done" | "Booked" | null;


export interface Lead {
  id: number | string; // Unique identifier for the lead
  name: string;
  company?: string; // Optional company name
  email?: string; // Optional email
  phone: string; // Primary phone number
  source?: string; // Lead source (e.g., Website, Referral, Upload)
  assignedTo?: string; // Employee ID or name assigned to the lead
  callDate?: string | null; // Format: YYYY-MM-DD or ISO string
  callTime?: string | null; // Optional: HH:MM
  callBookedLost?: 'Booked' | 'Lost' | null; // Status associated with Call Date
  callStatus?: CallStatus;
  callOutcome?: CallOutcome;
  nadDate?: string | null; // Next Action Date - Format: YYYY-MM-DD or ISO string
  nadBookedLost?: 'Booked' | 'Lost' | null; // Status associated with NAD Date
  remark?: string; // Caller's remarks
  location?: string; // Lead's location
  uploadDate?: string; // Date when the lead was uploaded/created
  lastUpdated?: string; // Timestamp of the last update

  // Prospect-specific fields
  leadStatus?: LeadStatus;
  leadResult?: LeadResult;

  // Add any other relevant fields from your Excel sheet
  // Example:
  // productInterest?: string;
  // budget?: number;
}
