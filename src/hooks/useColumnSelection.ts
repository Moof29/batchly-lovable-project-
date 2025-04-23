
import { useState, useEffect } from 'react';

export type ColumnConfig = {
  key: string;
  label: string;
  visible: boolean;
};

export const defaultCustomerColumns: ColumnConfig[] = [
  { key: 'display_name', label: 'Name', visible: true },
  { key: 'company_name', label: 'Company', visible: true },
  { key: 'phone', label: 'Phone', visible: true },
  { key: 'balance', label: 'Balance', visible: true },
  { key: 'email', label: 'Email', visible: false },
  { key: 'website', label: 'Website', visible: false },
  { key: 'mobile', label: 'Mobile', visible: false },
  { key: 'billing_city', label: 'City', visible: false },
  { key: 'billing_state', label: 'State', visible: false },
  { key: 'credit_limit', label: 'Credit Limit', visible: false },
  { key: 'payment_terms', label: 'Payment Terms', visible: false }
];

export const useColumnSelection = (storageKey: string, defaultColumns: ColumnConfig[]) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultColumns;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(columns));
  }, [columns, storageKey]);

  const toggleColumn = (columnKey: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return {
    columns,
    toggleColumn,
    visibleColumns: columns.filter(col => col.visible),
  };
};
