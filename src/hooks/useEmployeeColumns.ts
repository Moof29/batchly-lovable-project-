
import { ColumnConfig } from "./useColumnSelection";

export const defaultEmployeeColumns: ColumnConfig[] = [
  { key: 'last_name', label: 'Name', visible: true, order: 0 },
  { key: 'email', label: 'Email', visible: true, order: 1 },
  { key: 'phone', label: 'Phone', visible: true, order: 2 },
  { key: 'employment_type', label: 'Employment Type', visible: true, order: 3 },
  { key: 'department', label: 'Department', visible: false, order: 4 },
  { key: 'hire_date', label: 'Hire Date', visible: false, order: 5 },
  { key: 'manager', label: 'Manager', visible: false, order: 6 }
];

