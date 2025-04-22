
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AccountsReceivableTable } from "@/components/payments/AccountsReceivableTable";

export const AccountsReceivable = () => {
  const [sorting, setSorting] = useState({ column: "due_date", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["accounts-receivable", sorting, filters],
    queryFn: async () => {
      let query = supabase
        .from("invoice_record")
        .select("*, customer_profile(*)")
        .gt("balance_due", 0)
        .order(sorting.column, { ascending: sorting.direction === "asc" });

      // Apply filters
      Object.entries(filters).forEach(([column, value]) => {
        if (value) {
          query = query.ilike(column, `%${value}%`);
        }
      });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

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
