
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
import { useSalesOrders } from "@/hooks/useSalesOrders";
import { FilterDropdown } from "@/components/common/FilterDropdown";

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

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
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
                        onClick={() => handleSort("order_number")}
                        className="flex items-center hover:text-primary"
                      >
                        Order Number
                        {sorting.column === "order_number" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.order_number || ""}
                        onChange={(value) => handleFilter("order_number", value)}
                        placeholder="Filter by number..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("order_date")}
                        className="flex items-center hover:text-primary"
                      >
                        Date
                        {sorting.column === "order_date" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("customer_profile.display_name")}
                        className="flex items-center hover:text-primary"
                      >
                        Customer
                        {sorting.column === "customer_profile.display_name" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters["customer_profile.display_name"] || ""}
                        onChange={(value) => handleFilter("customer_profile.display_name", value)}
                        placeholder="Filter by customer..."
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
                        placeholder="Filter by status..."
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
                {salesOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.order_number}</TableCell>
                    <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.customer_profile?.display_name}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" asChild>
                        <Link to={`/sales/orders/${order.id}`}>View</Link>
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
