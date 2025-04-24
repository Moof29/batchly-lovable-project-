
import { ColumnConfig } from "./useColumnSelection";

export const defaultBillColumns: ColumnConfig[] = [
  { key: 'bill_number', label: 'Bill #', visible: true, order: 0 },
  { key: 'vendor_profile.display_name', label: 'Vendor', visible: true, order: 1 },
  { key: 'bill_date', label: 'Date', visible: true, order: 2 },
  { key: 'due_date', label: 'Due Date', visible: true, order: 3 },
  { key: 'total', label: 'Total', visible: true, order: 4 },
  { key: 'status', label: 'Status', visible: true, order: 5 },
  { key: 'payment_terms', label: 'Payment Terms', visible: false, order: 6 },
  { key: 'reference_number', label: 'Reference #', visible: false, order: 7 }
];

