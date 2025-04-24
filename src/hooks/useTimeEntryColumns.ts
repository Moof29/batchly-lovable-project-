
import { ColumnConfig } from "./useColumnSelection";

export const defaultTimeEntryColumns: ColumnConfig[] = [
  { key: 'date', label: 'Date', visible: true, order: 0 },
  { key: 'employee_profile.last_name', label: 'Employee', visible: true, order: 1 },
  { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
  { key: 'hours', label: 'Hours', visible: true, order: 3 },
  { key: 'billable', label: 'Billable', visible: true, order: 4 },
  { key: 'description', label: 'Description', visible: false, order: 5 },
  { key: 'billable_rate', label: 'Rate', visible: false, order: 6 },
  { key: 'break_time', label: 'Break Time', visible: false, order: 7 },
  { key: 'start_time', label: 'Start Time', visible: false, order: 8 },
  { key: 'end_time', label: 'End Time', visible: false, order: 9 },
  { key: 'service_item_id', label: 'Service Item', visible: false, order: 10 }
];
