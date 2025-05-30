
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useVendors } from "@/hooks/useVendors";
import { VendorsTable } from "@/components/people/VendorsTable";
import { ColumnSelector } from "@/components/common/ColumnSelector";
import { useColumnSelection } from "@/hooks/useColumnSelection";
import { defaultVendorColumns } from "@/hooks/useVendorColumns";

export const VendorList = () => {
  const [sorting, setSorting] = useState({ column: "display_name", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: vendors, isLoading } = useVendors(sorting, filters);
  const { columns, toggleColumn, moveColumn, reorderColumns, visibleColumns } = useColumnSelection(
    'vendor-list-columns',
    defaultVendorColumns
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
        <h1 className="text-2xl font-semibold tracking-tight">Vendors</h1>
        <Button asChild>
          <Link to="/people/vendors/new">
            <Plus className="mr-2 h-4 w-4" />
            New Vendor
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Vendors</CardTitle>
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
              <div className="text-sm text-muted-foreground">Loading vendors...</div>
            </div>
          ) : (
            <VendorsTable
              vendors={vendors || []}
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
