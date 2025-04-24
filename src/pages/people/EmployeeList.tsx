
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { EmployeesTable } from "@/components/people/EmployeesTable";
import { ColumnSelector } from "@/components/common/ColumnSelector";
import { useColumnSelection } from "@/hooks/useColumnSelection";
import { defaultEmployeeColumns } from "@/hooks/useEmployeeColumns";

export const EmployeeList = () => {
  const [sorting, setSorting] = useState({ column: "last_name", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: employees, isLoading } = useEmployees(sorting, filters);
  const { columns, toggleColumn, moveColumn, reorderColumns, visibleColumns } = useColumnSelection(
    'employee-list-columns',
    defaultEmployeeColumns
  );

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
        <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
        <Button asChild>
          <Link to="/people/employees/new">
            <Plus className="mr-2 h-4 w-4" />
            New Employee
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Employees</CardTitle>
            <ColumnSelector 
              columns={columns} 
              onToggle={toggleColumn} 
              onMove={moveColumn}
              onReorder={reorderColumns}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading employees...</div>
            </div>
          ) : (
            <EmployeesTable
              employees={employees || []}
              sorting={sorting}
              filters={filters}
              onSort={handleSort}
              onFilter={handleFilter}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
