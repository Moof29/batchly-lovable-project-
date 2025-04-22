
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";
import { FilterDropdown } from "@/components/common/FilterDropdown";

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
        <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>
        <Button asChild>
          <Link to="/purchases/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("purchase_order_number")}
                        className="flex items-center hover:text-primary"
                      >
                        PO Number
                        {sorting.column === "purchase_order_number" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.purchase_order_number || ""}
                        onChange={(value) => handleFilter("purchase_order_number", value)}
                        placeholder="Filter PO number..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("po_date")}
                        className="flex items-center hover:text-primary"
                      >
                        Date
                        {sorting.column === "po_date" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("vendor_profile.display_name")}
                        className="flex items-center hover:text-primary"
                      >
                        Vendor
                        {sorting.column === "vendor_profile.display_name" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters["vendor_profile.display_name"] || ""}
                        onChange={(value) => handleFilter("vendor_profile.display_name", value)}
                        placeholder="Filter vendors..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("status")}
                        className="flex items-center hover:text-primary"
                      >
                        Status
                        {sorting.column === "status" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.status || ""}
                        onChange={(value) => handleFilter("status", value)}
                        placeholder="Filter status..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("total")}
                        className="flex items-center hover:text-primary"
                      >
                        Total
                        {sorting.column === "total" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.purchase_order_number}</TableCell>
                    <TableCell>{new Date(order.po_date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.vendor_profile?.display_name}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" asChild>
                        <Link to={`/purchases/orders/${order.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
