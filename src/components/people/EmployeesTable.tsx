
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";

interface EmployeesTableProps {
  employees: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
}

export const EmployeesTable = ({ 
  employees, 
  sorting, 
  filters, 
  onSort, 
  onFilter 
}: EmployeesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("last_name")}
                  className="flex items-center hover:text-primary"
                >
                  Name
                  {sorting.column === "last_name" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.last_name || ""}
                  onChange={(value) => onFilter("last_name", value)}
                  placeholder="Filter by name..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("email")}
                  className="flex items-center hover:text-primary"
                >
                  Email
                  {sorting.column === "email" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.email || ""}
                  onChange={(value) => onFilter("email", value)}
                  placeholder="Filter by email..."
                />
              </div>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("employment_type")}
                  className="flex items-center hover:text-primary"
                >
                  Employment Type
                  {sorting.column === "employment_type" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.employment_type || ""}
                  onChange={(value) => onFilter("employment_type", value)}
                  placeholder="Filter by type..."
                />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees && employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50">
                <TableCell>{`${employee.first_name} ${employee.last_name}`}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {employee.employment_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/people/employees/${employee.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
