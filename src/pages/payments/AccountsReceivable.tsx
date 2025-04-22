
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AccountsReceivableTable } from "@/components/payments/AccountsReceivableTable";
import { useAccountsReceivable } from "@/hooks/useAccountsReceivable";

export const AccountsReceivable = () => {
  const [sorting, setSorting] = useState({ column: "due_date", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: invoices, isLoading } = useAccountsReceivable(sorting, filters);

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
      <h1 className="text-2xl font-semibold tracking-tight">Accounts Receivable</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Outstanding Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading invoices...</div>
            </div>
          ) : (
            <AccountsReceivableTable
              invoices={invoices || []}
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
