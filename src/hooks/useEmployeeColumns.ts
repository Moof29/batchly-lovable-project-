
import { ColumnConfig } from "./useColumnSelection";

export const defaultEmployeeColumns: ColumnConfig[] = [
  { key: 'last_name', label: 'Name', visible: true, order: 0 },
  { key: 'email', label: 'Email', visible: true, order: 1 },
  { key: 'phone', label: 'Phone', visible: true, order: 2 },
  { key: 'employment_type', label: 'Employment Type', visible: true, order: 3 },
  { key: 'department', label: 'Department', visible: false, order: 4 },
  { key: 'hire_date', label: 'Hire Date', visible: false, order: 5 },
  { key: 'mobile', label: 'Mobile', visible: false, order: 6 },
  { key: 'city', label: 'City', visible: false, order: 7 },
  { key: 'state', label: 'State', visible: false, order: 8 },
  { key: 'is_active', label: 'Active', visible: false, order: 9 }
];
