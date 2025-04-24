
import { ColumnConfig } from "./useColumnSelection";

export const defaultSalesOrderColumns: ColumnConfig[] = [
  { key: 'order_number', label: 'Order #', visible: true, order: 0 },
  { key: 'order_date', label: 'Date', visible: true, order: 1 },
  { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
  { key: 'status', label: 'Status', visible: true, order: 3 },
  { key: 'total', label: 'Total', visible: true, order: 4 },
  { key: 'customer_po_number', label: 'PO Number', visible: false, order: 5 },
  { key: 'shipping_method', label: 'Shipping Method', visible: false, order: 6 },
  { key: 'shipping_terms', label: 'Shipping Terms', visible: false, order: 7 },
  { key: 'promised_ship_date', label: 'Promise Date', visible: false, order: 8 },
  { key: 'requested_ship_date', label: 'Requested Date', visible: false, order: 9 }
];
