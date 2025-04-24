
import { ColumnConfig } from "./useColumnSelection";

export const defaultPurchaseOrderColumns: ColumnConfig[] = [
  { key: 'purchase_order_number', label: 'PO #', visible: true, order: 0 },
  { key: 'po_date', label: 'Date', visible: true, order: 1 },
  { key: 'vendor_profile.display_name', label: 'Vendor', visible: true, order: 2 },
  { key: 'status', label: 'Status', visible: true, order: 3 },
  { key: 'total', label: 'Total', visible: true, order: 4 },
  { key: 'expected_date', label: 'Expected Date', visible: false, order: 5 },
  { key: 'ship_to', label: 'Ship To', visible: false, order: 6 },
  { key: 'memo', label: 'Memo', visible: false, order: 7 },
  { key: 'currency_id', label: 'Currency', visible: false, order: 8 }
];
