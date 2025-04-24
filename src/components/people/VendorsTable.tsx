
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ColumnConfig } from "@/hooks/useColumnSelection";

interface VendorsTableProps {
  vendors: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
  visibleColumns: ColumnConfig[];
}

export const VendorsTable = ({
  vendors,
  sorting,
  filters,
  onSort,
  onFilter,
  visibleColumns
}: VendorsTableProps) => {
  const renderCell = (vendor: any, key: string) => {
    switch (key) {
      case 'account_number':
        return vendor[key] || '-';
      default:
        return vendor[key] || '-';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {visibleColumns.map(({ key, label }) => (
              <TableHead key={key}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSort(key)}
                    className="flex items-center hover:text-primary"
                  >
                    {label}
                    {sorting.column === key && (
                      sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                    )}
                  </button>
                  <FilterDropdown
                    value={filters[key] || ""}
                    onChange={(value) => onFilter(key, value)}
                    placeholder={`Filter by ${label.toLowerCase()}...`}
                  />
                </div>
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors && vendors.length > 0 ? (
            vendors.map((vendor) => (
              <TableRow key={vendor.id} className="hover:bg-muted/50">
                {visibleColumns.map(({ key }) => (
                  <TableCell key={key}>{renderCell(vendor, key)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/people/vendors/${vendor.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + 1} className="text-center py-4">
                No vendors found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
