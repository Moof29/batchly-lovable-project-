
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { BillListHeader } from "@/components/bills/BillListHeader";
import { BillsTable } from "@/components/bills/BillsTable";
import { useBills } from "@/hooks/useBills";
import { useColumnSelection } from "@/hooks/useColumnSelection";
import { defaultBillColumns } from "@/hooks/useBillColumns";
import { ColumnSelector } from "@/components/common/ColumnSelector";

export const BillList = () => {
  const [sorting, setSorting] = useState<{ column: string; direction: "asc" | "desc" }>({
    column: "bill_date",
    direction: "desc",
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: bills, isLoading } = useBills(sorting, filters);
  const { columns, toggleColumn, moveColumn, reorderColumns, visibleColumns } = useColumnSelection(
    'bill-list-columns',
    defaultBillColumns
  );

  const handleSort = (column: string) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleFilter = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <BillListHeader />
      <Card className="shadow-md">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Bills</CardTitle>
            <ColumnSelector 
              columns={columns} 
              onToggle={toggleColumn} 
              onMove={moveColumn}
              onReorder={reorderColumns}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading bills...</div>
            </div>
          ) : (
            <BillsTable
              bills={bills || []}
              sorting={sorting}
              filters={filters}
              onSort={handleSort}
              onFilter={handleFilter}
              visibleColumns={visibleColumns}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

