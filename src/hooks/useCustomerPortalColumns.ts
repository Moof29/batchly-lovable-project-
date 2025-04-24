
import { ColumnConfig } from "./useColumnSelection";

export const defaultCustomerPortalColumns: ColumnConfig[] = [
  { key: 'display_name', label: 'Name', visible: true, order: 0 },
  { key: 'email', label: 'Email', visible: true, order: 1 },
  { key: 'company_name', label: 'Company', visible: true, order: 2 },
  { key: 'last_login_at', label: 'Last Login', visible: true, order: 3 },
  { key: 'access_level', label: 'Access Level', visible: true, order: 4 },
  { key: 'status', label: 'Status', visible: true, order: 5 },
  { key: 'created_at', label: 'Created', visible: false, order: 6 },
  { key: 'phone', label: 'Phone', visible: false, order: 7 },
  { key: 'notes', label: 'Notes', visible: false, order: 8 }
];
