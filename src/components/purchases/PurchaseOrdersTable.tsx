
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "../common/FilterDropdown";
import { ColumnConfig } from "@/hooks/useColumnSelection";

interface PurchaseOrdersTableProps {
  purchaseOrders: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
  visibleColumns?: ColumnConfig[];
}

export const PurchaseOrdersTable = ({ 
  purchaseOrders, 
  sorting, 
  filters, 
  onSort, 
  onFilter,
  visibleColumns
}: PurchaseOrdersTableProps) => {
  // If no visibleColumns are provided, use the default columns
  const columnsToRender = visibleColumns || [
    { key: 'purchase_order_number', label: 'PO Number', visible: true, order: 0 },
    { key: 'po_date', label: 'Date', visible: true, order: 1 },
    { key: 'vendor_profile.display_name', label: 'Vendor', visible: true, order: 2 },
    { key: 'status', label: 'Status', visible: true, order: 3 },
    { key: 'total', label: 'Total', visible: true, order: 4 }
  ];

  // Convert column key to a more readable cell value
  const renderCell = (order: any, key: string) => {
    switch(key) {
      case 'purchase_order_number':
        return order.purchase_order_number;
      case 'po_date':
        return order.po_date ? new Date(order.po_date).toLocaleDateString() : '-';
      case 'vendor_profile.display_name':
        return order.vendor_profile?.display_name ? (
          <Link 
            to={`/people/vendors/${order.vendor_id}`}
            className="text-primary hover:underline"
          >
            {order.vendor_profile.display_name}
          </Link>
        ) : '-';
      case 'status':
        return (
          <Badge 
            variant={order.status === 'approved' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {order.status}
          </Badge>
        );
      case 'total':
        return `$${order.total?.toFixed(2) || '0.00'}`;
      default:
        return order[key] || '-';
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columnsToRender.map((column) => (
              <TableHead key={column.key}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSort(column.key)}
                    className="flex items-center hover:text-primary"
                  >
                    {column.label}
                    {sorting.column === column.key && (
                      sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                    )}
                  </button>
                  <FilterDropdown
                    value={filters[column.key] || ""}
                    onChange={(value) => onFilter(column.key, value)}
                    placeholder={`Filter ${column.label.toLowerCase()}...`}
                  />
                </div>
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders && purchaseOrders.length > 0 ? (
            purchaseOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                {columnsToRender.map((column) => (
                  <TableCell key={column.key}>{renderCell(order, column.key)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/purchases/orders/${order.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsToRender.length + 1} className="text-center py-4">
                No purchase orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
