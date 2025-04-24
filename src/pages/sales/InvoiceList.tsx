
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { InvoiceTable } from "@/components/sales/InvoiceTable";
import { useColumnSelection } from "@/hooks/useColumnSelection";
import { defaultInvoiceColumns } from "@/hooks/useInvoiceColumns";
import { ColumnSelector } from "@/components/common/ColumnSelector";

export const InvoiceList = () => {
  const [sorting, setSorting] = useState({ column: "invoice_date", direction: "desc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const { data: invoices, isLoading } = useInvoices(sorting, filters);
  const { columns, toggleColumn, moveColumn, reorderColumns, visibleColumns } = useColumnSelection(
    'invoice-list-columns',
    defaultInvoiceColumns
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
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <Button asChild>
          <Link to="/sales/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Invoices</CardTitle>
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
              <div className="text-sm text-muted-foreground">Loading invoices...</div>
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices || []}
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

