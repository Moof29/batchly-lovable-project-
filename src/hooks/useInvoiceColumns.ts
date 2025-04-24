
import { ColumnConfig } from "./useColumnSelection";

export const defaultInvoiceColumns: ColumnConfig[] = [
  { key: 'invoice_number', label: 'Invoice #', visible: true, order: 0 },
  { key: 'invoice_date', label: 'Date', visible: true, order: 1 },
  { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
  { key: 'status', label: 'Status', visible: true, order: 3 },
  { key: 'total', label: 'Total', visible: true, order: 4 },
  { key: 'balance_due', label: 'Balance Due', visible: true, order: 5 },
  { key: 'due_date', label: 'Due Date', visible: false, order: 6 },
  { key: 'payment_terms', label: 'Payment Terms', visible: false, order: 7 },
  { key: 'po_number', label: 'PO Number', visible: false, order: 8 },
  { key: 'shipping_method', label: 'Shipping Method', visible: false, order: 9 },
  { key: 'subtotal', label: 'Subtotal', visible: false, order: 10 },
  { key: 'discount_total', label: 'Discount', visible: false, order: 11 },
  { key: 'tax_total', label: 'Tax', visible: false, order: 12 },
  { key: 'shipping_total', label: 'Shipping', visible: false, order: 13 },
  { key: 'message', label: 'Message', visible: false, order: 14 },
  { key: 'memo', label: 'Memo', visible: false, order: 15 },
  { key: 'terms', label: 'Terms', visible: false, order: 16 },
  { key: 'currency_id', label: 'Currency', visible: false, order: 17 },
  { key: 'exchange_rate', label: 'Exchange Rate', visible: false, order: 18 },
  { key: 'ship_date', label: 'Ship Date', visible: false, order: 19 }
];
