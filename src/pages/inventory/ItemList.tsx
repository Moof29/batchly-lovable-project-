
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
import { useItems } from "@/hooks/useItems";
import { FilterDropdown } from "@/components/common/FilterDropdown";

export const ItemList = () => {
  const [sorting, setSorting] = useState({ column: "name", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: items, isLoading } = useItems(sorting, filters);

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
        <h1 className="text-2xl font-semibold tracking-tight">Items</h1>
        <Button asChild>
          <Link to="/inventory/items/new">
            <Plus className="mr-2 h-4 w-4" />
            New Item
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Items</CardTitle>
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
                        onClick={() => handleSort("name")}
                        className="flex items-center hover:text-primary"
                      >
                        Name
                        {sorting.column === "name" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.name || ""}
                        onChange={(value) => handleFilter("name", value)}
                        placeholder="Filter by name..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("sku")}
                        className="flex items-center hover:text-primary"
                      >
                        SKU
                        {sorting.column === "sku" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.sku || ""}
                        onChange={(value) => handleFilter("sku", value)}
                        placeholder="Filter by SKU..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("item_type")}
                        className="flex items-center hover:text-primary"
                      >
                        Type
                        {sorting.column === "item_type" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.item_type || ""}
                        onChange={(value) => handleFilter("item_type", value)}
                        placeholder="Filter by type..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("item_pricing.price")}
                        className="flex items-center hover:text-primary"
                      >
                        Price
                        {sorting.column === "item_pricing.price" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.item_type}</TableCell>
                    <TableCell>${item.item_pricing?.price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" asChild>
                        <Link to={`/inventory/items/${item.id}`}>View</Link>
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
