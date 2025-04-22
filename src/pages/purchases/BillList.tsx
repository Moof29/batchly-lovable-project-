
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
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Download, ArrowDownAZ, ArrowUpAZ, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const BillList = () => {
  const [sorting, setSorting] = useState<{ column: string; direction: "asc" | "desc" }>({
    column: "bill_date",
    direction: "desc",
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: bills, isLoading } = useQuery({
    queryKey: ["bills", sorting, filters],
    queryFn: async () => {
      let query = supabase
        .from("bill_record")
        .select("*, vendor_profile(display_name)")
        .order(sorting.column, { ascending: sorting.direction === "asc" });

      // Apply filters
      Object.entries(filters).forEach(([column, value]) => {
        if (value) {
          query = query.ilike(column, `%${value}%`);
        }
      });

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Bills</h1>
          <p className="text-sm text-muted-foreground">Manage and track your bills from vendors</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link to="/purchases/bills/new">
              <Plus className="mr-2 h-4 w-4" />
              New Bill
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader className="py-4">
          <CardTitle>All Bills</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading bills...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("bill_number")}
                          className="flex items-center hover:text-primary"
                        >
                          Bill #
                          {sorting.column === "bill_number" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <div className="p-2">
                              <Input
                                placeholder="Filter bills..."
                                value={filters.bill_number || ""}
                                onChange={(e) => handleFilter("bill_number", e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("vendor_profile.display_name")}
                          className="flex items-center hover:text-primary"
                        >
                          Vendor
                          {sorting.column === "vendor_profile.display_name" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <div className="p-2">
                              <Input
                                placeholder="Filter vendors..."
                                value={filters["vendor_profile.display_name"] || ""}
                                onChange={(e) => handleFilter("vendor_profile.display_name", e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("bill_date")}
                          className="flex items-center hover:text-primary"
                        >
                          Date
                          {sorting.column === "bill_date" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("due_date")}
                          className="flex items-center hover:text-primary"
                        >
                          Due Date
                          {sorting.column === "due_date" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSort("total")}
                          className="flex items-center hover:text-primary"
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
                          onClick={() => handleSort("status")}
                          className="flex items-center hover:text-primary"
                        >
                          Status
                          {sorting.column === "status" && (
                            sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                          )}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <div className="p-2">
                              <Input
                                placeholder="Filter status..."
                                value={filters.status || ""}
                                onChange={(e) => handleFilter("status", e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills?.map((bill) => (
                    <TableRow key={bill.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{bill.bill_number}</TableCell>
                      <TableCell>{bill.vendor_profile?.display_name}</TableCell>
                      <TableCell>{new Date(bill.bill_date).toLocaleDateString()}</TableCell>
                      <TableCell>{bill.due_date ? new Date(bill.due_date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>${bill.total?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={bill.status === 'paid' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/purchases/bills/${bill.id}`}>View</Link>
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
