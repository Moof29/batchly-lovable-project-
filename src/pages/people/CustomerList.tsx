
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
import { useCustomers } from "@/hooks/useCustomers";
import { FilterDropdown } from "@/components/common/FilterDropdown";

export const CustomerList = () => {
  const [sorting, setSorting] = useState({ column: "display_name", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: customers, isLoading } = useCustomers(sorting, filters);

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
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <Button asChild>
          <Link to="/people/customers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("display_name")}
                        className="flex items-center hover:text-primary"
                      >
                        Name
                        {sorting.column === "display_name" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.display_name || ""}
                        onChange={(value) => handleFilter("display_name", value)}
                        placeholder="Filter by name..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("email")}
                        className="flex items-center hover:text-primary"
                      >
                        Email
                        {sorting.column === "email" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.email || ""}
                        onChange={(value) => handleFilter("email", value)}
                        placeholder="Filter by email..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("phone")}
                        className="flex items-center hover:text-primary"
                      >
                        Phone
                        {sorting.column === "phone" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("balance")}
                        className="flex items-center hover:text-primary"
                      >
                        Balance
                        {sorting.column === "balance" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers?.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.display_name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>${customer.balance?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" asChild>
                        <Link to={`/people/customers/${customer.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
