
import { ColumnConfig } from "./useColumnSelection";

export const defaultEmployeeColumns: ColumnConfig[] = [
  { key: 'last_name', label: 'Last Name', visible: true, order: 0 },
  { key: 'first_name', label: 'First Name', visible: true, order: 1 },
  { key: 'email', label: 'Email', visible: true, order: 2 },
  { key: 'phone', label: 'Phone', visible: true, order: 3 },
  { key: 'employment_type', label: 'Employment Type', visible: true, order: 4 },
  { key: 'display_name', label: 'Display Name', visible: false, order: 5 },
  { key: 'middle_name', label: 'Middle Name', visible: false, order: 6 },
  { key: 'mobile', label: 'Mobile', visible: false, order: 7 },
  { key: 'address_line1', label: 'Address Line 1', visible: false, order: 8 },
  { key: 'address_line2', label: 'Address Line 2', visible: false, order: 9 },
  { key: 'city', label: 'City', visible: false, order: 10 },
  { key: 'state', label: 'State', visible: false, order: 11 },
  { key: 'postal_code', label: 'Postal Code', visible: false, order: 12 },
  { key: 'country', label: 'Country', visible: false, order: 13 },
  { key: 'hire_date', label: 'Hire Date', visible: false, order: 14 },
  { key: 'release_date', label: 'Release Date', visible: false, order: 15 },
  { key: 'birth_date', label: 'Birth Date', visible: false, order: 16 },
  { key: 'gender', label: 'Gender', visible: false, order: 17 },
  { key: 'is_active', label: 'Active', visible: false, order: 18 }
];
