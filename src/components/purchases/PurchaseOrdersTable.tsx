
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "../common/FilterDropdown";

interface PurchaseOrdersTableProps {
  purchaseOrders: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
}

export const PurchaseOrdersTable = ({ 
  purchaseOrders, 
  sorting, 
  filters, 
  onSort, 
  onFilter 
}: PurchaseOrdersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("purchase_order_number")}
                  className="flex items-center hover:text-primary"
                >
                  PO Number
                  {sorting.column === "purchase_order_number" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.purchase_order_number || ""}
                  onChange={(value) => onFilter("purchase_order_number", value)}
                  placeholder="Filter PO number..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("po_date")}
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
                  onClick={() => onSort("vendor_profile.display_name")}
                  className="flex items-center hover:text-primary"
                >
                  Vendor
                  {sorting.column === "vendor_profile.display_name" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters["vendor_profile.display_name"] || ""}
                  onChange={(value) => onFilter("vendor_profile.display_name", value)}
                  placeholder="Filter vendors..."
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
                  placeholder="Filter status..."
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
          {purchaseOrders && purchaseOrders.length > 0 ? (
            purchaseOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{order.purchase_order_number}</TableCell>
                <TableCell>{order.po_date ? new Date(order.po_date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  {order.vendor_profile?.display_name ? (
                    <Link 
                      to={`/people/vendors/${order.vendor_id}`}
                      className="text-primary hover:underline"
                    >
                      {order.vendor_profile.display_name}
                    </Link>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={order.status === 'approved' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>${order.total?.toFixed(2) || '0.00'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/purchases/orders/${order.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No purchase orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
