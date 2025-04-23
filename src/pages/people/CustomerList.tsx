
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomersTable } from "@/components/people/CustomersTable";
import { ColumnSelector } from "@/components/common/ColumnSelector";
import { useColumnSelection, defaultCustomerColumns } from "@/hooks/useColumnSelection";

export const CustomerList = () => {
  const [sorting, setSorting] = useState({ column: "display_name", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data: customers, isLoading } = useCustomers(sorting, filters);
  
  const { columns, toggleColumn, moveColumn, reorderColumns, visibleColumns } = useColumnSelection(
    'customer-list-columns',
    defaultCustomerColumns
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
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">View and manage your customer accounts</p>
        </div>
        <Button asChild>
          <Link to="/people/customers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Customers</CardTitle>
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
              <div className="text-sm text-muted-foreground">Loading customers...</div>
            </div>
          ) : (
            <CustomersTable
              customers={customers || []}
              sorting={sorting}
              filters={filters}
              onSort={handleSort}
              onFilter={handleFilter}
              visibleColumns={visibleColumns}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
