
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ColumnConfig } from "@/hooks/useColumnSelection";

interface EmployeesTableProps {
  employees: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
  visibleColumns?: ColumnConfig[];
}

export const EmployeesTable = ({ 
  employees, 
  sorting, 
  filters, 
  onSort, 
  onFilter,
  visibleColumns
}: EmployeesTableProps) => {
  // If no visibleColumns are provided, use the default columns
  const columnsToRender = visibleColumns || [
    { key: 'last_name', label: 'Name', visible: true, order: 0 },
    { key: 'email', label: 'Email', visible: true, order: 1 },
    { key: 'phone', label: 'Phone', visible: true, order: 2 },
    { key: 'employment_type', label: 'Employment Type', visible: true, order: 3 }
  ];

  // Convert column key to a more readable cell value
  const renderCell = (employee: any, key: string) => {
    switch(key) {
      case 'last_name':
        return `${employee.first_name} ${employee.last_name}`;
      case 'email':
        return employee.email;
      case 'phone':
        return employee.phone;
      case 'employment_type':
        return (
          <Badge variant="secondary" className="capitalize">
            {employee.employment_type}
          </Badge>
        );
      default:
        return employee[key] || '-';
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
                    placeholder={`Filter by ${column.label.toLowerCase()}...`}
                  />
                </div>
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees && employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50">
                {columnsToRender.map((column) => (
                  <TableCell key={column.key}>{renderCell(employee, column.key)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/people/employees/${employee.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsToRender.length + 1} className="text-center py-4 text-muted-foreground">
                No employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
