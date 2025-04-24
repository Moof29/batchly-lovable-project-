
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ColumnConfig } from "@/hooks/useColumnSelection";

interface TimeEntriesTableProps {
  timeEntries: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
  visibleColumns?: ColumnConfig[];
}

export const TimeEntriesTable = ({
  timeEntries,
  sorting,
  filters,
  onSort,
  onFilter,
  visibleColumns
}: TimeEntriesTableProps) => {
  // If no visibleColumns are provided, use the default columns
  const columnsToRender = visibleColumns || [
    { key: 'date', label: 'Date', visible: true, order: 0 },
    { key: 'employee_profile.last_name', label: 'Employee', visible: true, order: 1 },
    { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
    { key: 'hours', label: 'Hours', visible: true, order: 3 },
    { key: 'billable', label: 'Status', visible: true, order: 4 }
  ];

  // Convert column key to a more readable cell value
  const renderCell = (entry: any, key: string) => {
    switch(key) {
      case 'date':
        return new Date(entry.date).toLocaleDateString();
      case 'employee_profile.last_name':
        return `${entry.employee_profile?.first_name} ${entry.employee_profile?.last_name}`;
      case 'customer_profile.display_name':
        return entry.customer_profile?.display_name;
      case 'hours':
        return entry.hours;
      case 'billable':
        return entry.billable ? 'Billable' : 'Non-billable';
      default:
        return entry[key] || '-';
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
          {timeEntries?.map((entry) => (
            <TableRow key={entry.id} className="hover:bg-muted/50">
              {columnsToRender.map((column) => (
                <TableCell key={column.key}>{renderCell(entry, column.key)}</TableCell>
              ))}
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/people/time-tracking/${entry.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {(!timeEntries || timeEntries.length === 0) && (
            <TableRow>
              <TableCell colSpan={columnsToRender.length + 1} className="text-center py-4 text-muted-foreground">
                No time entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
