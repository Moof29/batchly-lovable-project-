
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { PermissionGate } from "@/components/PermissionGate";
import { useDevMode } from "@/contexts/DevModeContext";

export const ItemList = () => {
  const { isDevMode } = useDevMode();
  console.log("[ItemList] Rendering, devMode:", isDevMode);
  
  const { data: items, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      console.log("[ItemList] Fetching items data");
      
      if (isDevMode) {
        // Provide mock data in dev mode
        console.log("[ItemList] Using mock data in dev mode");
        return [
          {
            id: "mock-1",
            sku: "ITEM-001",
            name: "Mock Item 1",
            item_type: "product",
            item_pricing: [{ price: 19.99 }],
          },
          {
            id: "mock-2",
            sku: "ITEM-002",
            name: "Mock Item 2",
            item_type: "service",
            item_pricing: [{ price: 29.99 }],
          },
        ];
      }
      
      const { data, error } = await supabase
        .from("item_record")
        .select(`
          *,
          item_pricing(price)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error("[ItemList] Error fetching items:", error);
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Inventory Items</h1>
        <PermissionGate resource="items" action="create">
          <Button asChild>
            <Link to="/inventory/items/new">
              <Plus className="mr-2 h-4 w-4" />
              New Item
            </Link>
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
              <span className="ml-2">Loading items...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="capitalize">{item.item_type}</TableCell>
                    <TableCell>
                      ${item.item_pricing?.[0]?.price?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">
                      <PermissionGate resource="items" action="read">
                        <Button variant="outline" asChild>
                          <Link to={`/inventory/items/${item.id}`}>View</Link>
                        </Button>
                      </PermissionGate>
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
