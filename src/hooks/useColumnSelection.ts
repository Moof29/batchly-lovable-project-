
import { useState, useEffect } from 'react';

export type ColumnConfig = {
  key: string;
  label: string;
  visible: boolean;
  order: number;
};

export const defaultCustomerColumns: ColumnConfig[] = [
  { key: 'display_name', label: 'Name', visible: true, order: 0 },
  { key: 'company_name', label: 'Company', visible: true, order: 1 },
  { key: 'phone', label: 'Phone', visible: true, order: 2 },
  { key: 'balance', label: 'Balance', visible: true, order: 3 },
  { key: 'email', label: 'Email', visible: false, order: 4 },
  { key: 'website', label: 'Website', visible: false, order: 5 },
  { key: 'mobile', label: 'Mobile', visible: false, order: 6 },
  { key: 'billing_city', label: 'City', visible: false, order: 7 },
  { key: 'billing_state', label: 'State', visible: false, order: 8 },
  { key: 'credit_limit', label: 'Credit Limit', visible: false, order: 9 },
  { key: 'payment_terms', label: 'Payment Terms', visible: false, order: 10 }
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

  const moveColumn = (columnKey: string, direction: 'up' | 'down') => {
    setColumns(prev => {
      const currentIndex = prev.findIndex(col => col.key === columnKey);
      if (currentIndex < 0) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newColumns = [...prev];
      const temp = newColumns[currentIndex].order;
      newColumns[currentIndex].order = newColumns[newIndex].order;
      newColumns[newIndex].order = temp;
      
      return newColumns.sort((a, b) => a.order - b.order);
    });
  };

  return {
    columns,
    toggleColumn,
    moveColumn,
    visibleColumns: columns.filter(col => col.visible).sort((a, b) => a.order - b.order),
  };
};
