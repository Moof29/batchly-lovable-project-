
import { ColumnConfig } from "./useColumnSelection";

export const defaultVendorColumns: ColumnConfig[] = [
  { key: 'display_name', label: 'Name', visible: true, order: 0 },
  { key: 'email', label: 'Email', visible: true, order: 1 },
  { key: 'phone', label: 'Phone', visible: true, order: 2 },
  { key: 'account_number', label: 'Account Number', visible: true, order: 3 },
  { key: 'website', label: 'Website', visible: false, order: 4 },
  { key: 'tax_number', label: 'Tax Number', visible: false, order: 5 },
  { key: 'billing_city', label: 'City', visible: false, order: 6 },
  { key: 'billing_state', label: 'State', visible: false, order: 7 }
];

