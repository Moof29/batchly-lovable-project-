
import { ColumnConfig } from "./useColumnSelection";

export const defaultTimeEntryColumns: ColumnConfig[] = [
  { key: 'date', label: 'Date', visible: true, order: 0 },
  { key: 'employee_profile.last_name', label: 'Employee', visible: true, order: 1 },
  { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
  { key: 'hours', label: 'Hours', visible: true, order: 3 },
  { key: 'billable', label: 'Status', visible: true, order: 4 },
  { key: 'description', label: 'Description', visible: false, order: 5 },
  { key: 'project', label: 'Project', visible: false, order: 6 }
];

