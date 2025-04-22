
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";
import { PurchaseOrdersTable } from "@/components/purchases/PurchaseOrdersTable";

export const PurchaseOrderList = () => {
  const [sorting, setSorting] = useState({ column: "po_date", direction: "desc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: purchaseOrders, isLoading } = usePurchaseOrders(sorting, filters);

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
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and track your purchase orders</p>
        </div>
        <Button asChild>
          <Link to="/purchases/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader className="py-4">
          <CardTitle>All Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading purchase orders...</div>
            </div>
          ) : (
            <PurchaseOrdersTable
              purchaseOrders={purchaseOrders || []}
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
