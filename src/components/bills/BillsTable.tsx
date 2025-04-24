
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "./FilterDropdown";
import { ColumnConfig } from "@/hooks/useColumnSelection";

interface BillsTableProps {
  bills: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
  visibleColumns?: ColumnConfig[];
}

export const BillsTable = ({ bills, sorting, filters, onSort, onFilter, visibleColumns }: BillsTableProps) => {
  // If no visibleColumns are provided, use the default columns
  const columnsToRender = visibleColumns || [
    { key: 'bill_number', label: 'Bill #', visible: true, order: 0 },
    { key: 'vendor_profile.display_name', label: 'Vendor', visible: true, order: 1 },
    { key: 'bill_date', label: 'Date', visible: true, order: 2 },
    { key: 'due_date', label: 'Due Date', visible: true, order: 3 },
    { key: 'total', label: 'Total', visible: true, order: 4 },
    { key: 'status', label: 'Status', visible: true, order: 5 },
  ];

  // Safe handler for vendor sort to prevent any event propagation issues
  const handleVendorSort = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Vendor sort clicked");
    onSort("vendor_profile.display_name");
  };
  
  // Convert column key to a more readable cell value
  const renderCell = (bill: any, key: string) => {
    switch(key) {
      case 'bill_number':
        return bill.bill_number;
      case 'vendor_profile.display_name':
        return bill.vendor_profile?.display_name ? (
          <Link 
            to={`/people/vendors/${bill.vendor_id}`}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {bill.vendor_profile.display_name}
          </Link>
        ) : '-';
      case 'bill_date':
        return bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : '-';
      case 'due_date':
        return bill.due_date ? new Date(bill.due_date).toLocaleDateString() : '-';
      case 'total':
        return `$${bill.total?.toFixed(2) || '0.00'}`;
      case 'status':
        return (
          <Badge 
            variant={bill.status === 'paid' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {bill.status}
          </Badge>
        );
      default:
        return bill[key] || '-';
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
          {bills && bills.length > 0 ? (
            bills.map((bill) => (
              <TableRow key={bill.id} className="hover:bg-muted/50">
                {columnsToRender.map((column) => (
                  <TableCell key={column.key}>{renderCell(bill, column.key)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/purchases/bills/${bill.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsToRender.length + 1} className="text-center py-4">
                No bills found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
