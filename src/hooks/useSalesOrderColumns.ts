
import { ColumnConfig } from "./useColumnSelection";

export const defaultSalesOrderColumns: ColumnConfig[] = [
  { key: 'order_number', label: 'Order Number', visible: true, order: 0 },
  { key: 'order_date', label: 'Date', visible: true, order: 1 },
  { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
  { key: 'status', label: 'Status', visible: true, order: 3 },
  { key: 'total', label: 'Total', visible: true, order: 4 },
  { key: 'expected_delivery', label: 'Expected Delivery', visible: false, order: 5 },
  { key: 'payment_terms', label: 'Payment Terms', visible: false, order: 6 }
];
