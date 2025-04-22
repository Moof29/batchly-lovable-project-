
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSalesOrders } from "@/hooks/useSalesOrders";
import { SalesOrdersTable } from "@/components/orders/SalesOrdersTable";

export const SalesOrderList = () => {
  const [sorting, setSorting] = useState({ column: "order_date", direction: "desc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: salesOrders, isLoading } = useSalesOrders(sorting, filters);

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Sales Orders</h1>
        <Button asChild>
          <Link to="/sales/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading orders...</div>
            </div>
          ) : (
            <SalesOrdersTable
              salesOrders={salesOrders || []}
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
