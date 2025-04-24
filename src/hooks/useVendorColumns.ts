
import { ColumnConfig } from "./useColumnSelection";

export const defaultVendorColumns: ColumnConfig[] = [
  { key: 'display_name', label: 'Name', visible: true, order: 0 },
  { key: 'company_name', label: 'Company', visible: true, order: 1 },
  { key: 'email', label: 'Email', visible: true, order: 2 },
  { key: 'phone', label: 'Phone', visible: true, order: 3 },
  { key: 'account_number', label: 'Account Number', visible: true, order: 4 },
  { key: 'tax_id', label: 'Tax ID', visible: false, order: 5 },
  { key: 'website', label: 'Website', visible: false, order: 6 },
  { key: 'billing_city', label: 'Billing City', visible: false, order: 7 },
  { key: 'billing_state', label: 'Billing State', visible: false, order: 8 },
  { key: 'payment_terms', label: 'Payment Terms', visible: false, order: 9 },
  { key: 'is_active', label: 'Active', visible: false, order: 10 }
];
