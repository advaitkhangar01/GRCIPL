export interface UploadHistoryEntry {
  id: string | number; // Unique identifier for the upload event
  fileName: string;
  uploadTimestamp: string; // ISO string format
  uploadedBy: string; // User ID or name
  leadCount: number; // Number of leads in the uploaded file
  status: 'Processing' | 'Completed' | 'Failed';
  errorMessage?: string; // Optional error message if status is Failed
}
