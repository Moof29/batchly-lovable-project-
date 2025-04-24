
import { ColumnConfig } from "./useColumnSelection";

export const defaultInvoiceColumns: ColumnConfig[] = [
  { key: 'invoice_number', label: 'Invoice #', visible: true, order: 0 },
  { key: 'invoice_date', label: 'Date', visible: true, order: 1 },
  { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
  { key: 'status', label: 'Status', visible: true, order: 3 },
  { key: 'total', label: 'Total', visible: true, order: 4 },
  { key: 'balance_due', label: 'Balance Due', visible: true, order: 5 },
  { key: 'payment_terms', label: 'Payment Terms', visible: false, order: 6 },
  { key: 'due_date', label: 'Due Date', visible: false, order: 7 }
];

