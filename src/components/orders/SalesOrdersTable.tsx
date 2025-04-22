
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";

interface SalesOrdersTableProps {
  salesOrders: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
}

export const SalesOrdersTable = ({
  salesOrders,
  sorting,
  filters,
  onSort,
  onFilter
}: SalesOrdersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("order_number")}
                  className="flex items-center hover:text-primary"
                >
                  Order Number
                  {sorting.column === "order_number" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.order_number || ""}
                  onChange={(value) => onFilter("order_number", value)}
                  placeholder="Filter by number..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("order_date")}
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
                  onClick={() => onSort("customer_profile.display_name")}
                  className="flex items-center hover:text-primary"
                >
                  Customer
                  {sorting.column === "customer_profile.display_name" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters["customer_profile.display_name"] || ""}
                  onChange={(value) => onFilter("customer_profile.display_name", value)}
                  placeholder="Filter by customer..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center hover:text-primary"
                >
                  Status
                  {sorting.column === "status" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.status || ""}
                  onChange={(value) => onFilter("status", value)}
                  placeholder="Filter by status..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("total")}
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
          {salesOrders && salesOrders.length > 0 ? (
            salesOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell>{order.order_number}</TableCell>
                <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                <TableCell>{order.customer_profile?.display_name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize bg-primary/10 text-primary">
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/sales/orders/${order.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
