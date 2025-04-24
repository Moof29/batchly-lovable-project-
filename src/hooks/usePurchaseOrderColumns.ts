
import { ColumnConfig } from "./useColumnSelection";

export const defaultPurchaseOrderColumns: ColumnConfig[] = [
  { key: 'purchase_order_number', label: 'PO Number', visible: true, order: 0 },
  { key: 'po_date', label: 'Date', visible: true, order: 1 },
  { key: 'vendor_profile.display_name', label: 'Vendor', visible: true, order: 2 },
  { key: 'status', label: 'Status', visible: true, order: 3 },
  { key: 'total', label: 'Total', visible: true, order: 4 },
  { key: 'expected_delivery', label: 'Expected Delivery', visible: false, order: 5 },
  { key: 'shipping_method', label: 'Shipping Method', visible: false, order: 6 }
];

