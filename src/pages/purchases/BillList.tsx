
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { BillListHeader } from "@/components/bills/BillListHeader";
import { BillsTable } from "@/components/bills/BillsTable";
import { useBills } from "@/hooks/useBills";

export const BillList = () => {
  const [sorting, setSorting] = useState<{ column: string; direction: "asc" | "desc" }>({
    column: "bill_date",
    direction: "desc",
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: bills, isLoading } = useBills(sorting, filters);

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
          <CardTitle>All Bills</CardTitle>
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
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
