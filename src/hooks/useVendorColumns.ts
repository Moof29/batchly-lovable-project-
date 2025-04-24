
import { ColumnConfig } from "./useColumnSelection";

export const defaultVendorColumns: ColumnConfig[] = [
  { key: 'display_name', label: 'Name', visible: true, order: 0 },
  { key: 'company_name', label: 'Company', visible: true, order: 1 },
  { key: 'email', label: 'Email', visible: true, order: 2 },
  { key: 'phone', label: 'Phone', visible: true, order: 3 },
  { key: 'account_number', label: 'Account Number', visible: true, order: 4 },
  { key: 'first_name', label: 'First Name', visible: false, order: 5 },
  { key: 'last_name', label: 'Last Name', visible: false, order: 6 },
  { key: 'mobile', label: 'Mobile', visible: false, order: 7 },
  { key: 'fax', label: 'Fax', visible: false, order: 8 },
  { key: 'website', label: 'Website', visible: false, order: 9 },
  { key: 'billing_address_line1', label: 'Address Line 1', visible: false, order: 10 },
  { key: 'billing_address_line2', label: 'Address Line 2', visible: false, order: 11 },
  { key: 'billing_city', label: 'City', visible: false, order: 12 },
  { key: 'billing_state', label: 'State', visible: false, order: 13 },
  { key: 'billing_postal_code', label: 'Postal Code', visible: false, order: 14 },
  { key: 'billing_country', label: 'Country', visible: false, order: 15 },
  { key: 'tax_id', label: 'Tax ID', visible: false, order: 16 },
  { key: 'payment_terms', label: 'Payment Terms', visible: false, order: 17 },
  { key: 'is_active', label: 'Active', visible: false, order: 18 },
  { key: 'is_1099', label: '1099 Vendor', visible: false, order: 19 },
  { key: 'notes', label: 'Notes', visible: false, order: 20 }
];
