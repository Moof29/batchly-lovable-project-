
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

export const PurchaseOrderList = () => {
  const { data: purchaseOrders, isLoading } = useQuery({
    queryKey: ["purchaseOrders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_order")
        .select(`
          *,
          vendor_profile:vendor_id(display_name)
        `)
        .order("po_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>
        <Button asChild>
          <Link to="/purchases/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.purchase_order_number}</TableCell>
                    <TableCell>{new Date(order.po_date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.vendor_profile?.display_name}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" asChild>
                        <Link to={`/purchases/orders/${order.id}`}>View</Link>
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
