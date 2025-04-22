
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";

interface TimeEntriesTableProps {
  timeEntries: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
}

export const TimeEntriesTable = ({
  timeEntries,
  sorting,
  filters,
  onSort,
  onFilter,
}: TimeEntriesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("date")}
                  className="flex items-center hover:text-primary"
                >
                  Date
                  {sorting.column === "date" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("employee_profile.last_name")}
                  className="flex items-center hover:text-primary"
                >
                  Employee
                  {sorting.column === "employee_profile.last_name" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters["employee_profile.last_name"] || ""}
                  onChange={(value) => onFilter("employee_profile.last_name", value)}
                  placeholder="Filter employees..."
                />
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
                  placeholder="Filter customers..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("hours")}
                  className="flex items-center hover:text-primary"
                >
                  Hours
                  {sorting.column === "hours" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("billable")}
                  className="flex items-center hover:text-primary"
                >
                  Status
                  {sorting.column === "billable" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeEntries?.map((entry) => (
            <TableRow key={entry.id} className="hover:bg-muted/50">
              <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
              <TableCell>
                {entry.employee_profile?.first_name} {entry.employee_profile?.last_name}
              </TableCell>
              <TableCell>{entry.customer_profile?.display_name}</TableCell>
              <TableCell>{entry.hours}</TableCell>
              <TableCell className="capitalize">
                {entry.billable ? 'Billable' : 'Non-billable'}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/people/time-tracking/${entry.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
