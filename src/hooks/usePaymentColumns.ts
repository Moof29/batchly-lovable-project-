
import { ColumnConfig } from "./useColumnSelection";

export const defaultPaymentColumns: ColumnConfig[] = [
  { key: 'payment_number', label: 'Payment #', visible: true, order: 0 },
  { key: 'payment_date', label: 'Date', visible: true, order: 1 },
  { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
  { key: 'total_amount', label: 'Amount', visible: true, order: 3 },
  { key: 'payment_status', label: 'Status', visible: true, order: 4 },
  { key: 'payment_method', label: 'Method', visible: true, order: 5 },
  { key: 'reference_number', label: 'Reference #', visible: false, order: 6 },
  { key: 'memo', label: 'Memo', visible: false, order: 7 },
  { key: 'unapplied_amount', label: 'Unapplied', visible: false, order: 8 },
  { key: 'currency_id', label: 'Currency', visible: false, order: 9 }
];
