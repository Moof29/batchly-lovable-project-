
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { FilterDropdown } from "@/components/common/FilterDropdown";

export const InvoiceList = () => {
  const [sorting, setSorting] = useState({ column: "invoice_date", direction: "desc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const { data: invoices, isLoading } = useInvoices(sorting, filters);

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
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your customer invoices
          </p>
        </div>
        <Button asChild>
          <Link to="/sales/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader className="px-6">
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading...
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("invoice_number")}
                          className="flex items-center hover:text-primary"
                        >
                          Invoice #
                          {sorting.column === "invoice_number" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                        <FilterDropdown
                          value={filters.invoice_number || ""}
                          onChange={(value) => handleFilter("invoice_number", value)}
                          placeholder="Filter by number..."
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("invoice_date")}
                          className="flex items-center hover:text-primary"
                        >
                          Date
                          {sorting.column === "invoice_date" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("customer_profile.display_name")}
                          className="flex items-center hover:text-primary"
                        >
                          Customer
                          {sorting.column === "customer_profile.display_name" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                        <FilterDropdown
                          value={filters["customer_profile.display_name"] || ""}
                          onChange={(value) => handleFilter("customer_profile.display_name", value)}
                          placeholder="Filter by customer..."
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center hover:text-primary"
                        >
                          Status
                          {sorting.column === "status" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                        <FilterDropdown
                          value={filters.status || ""}
                          onChange={(value) => handleFilter("status", value)}
                          placeholder="Filter by status..."
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("total")}
                          className="flex items-center hover:text-primary text-right w-full"
                        >
                          Total
                          {sorting.column === "total" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("balance_due")}
                          className="flex items-center hover:text-primary text-right w-full"
                        >
                          Balance Due
                          {sorting.column === "balance_due" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices?.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.customer_profile?.display_name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize bg-primary/10 text-primary">
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${invoice.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${invoice.balance_due.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/sales/invoices/${invoice.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
