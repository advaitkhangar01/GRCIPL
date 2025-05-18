export interface AttendanceRecord {
  id: string | number; // Unique ID for the record
  employeeId: string; // ID of the employee
  date: string; // YYYY-MM-DD format
  inTime: string | null; // HH:MM format or null
  outTime: string | null; // HH:MM format or null
  lastUpdated: string; // ISO timestamp
}
