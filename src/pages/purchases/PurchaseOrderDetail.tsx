
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const PurchaseOrderDetail = () => {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["purchaseOrder", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_order")
        .select(`
          *,
          vendor_profile:vendor_id(display_name),
          purchase_order_line_item(
            *,
            item_record:item_id(name, sku)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Purchase Order {order.purchase_order_number}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Vendor</dt>
                <dd className="text-sm">{order.vendor_profile?.display_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-sm capitalize">{order.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                <dd className="text-sm">
                  {new Date(order.po_date).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="text-lg font-bold">${order.total.toFixed(2)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.purchase_order_line_item?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.item_record?.name}
                      <br />
                      <span className="text-sm text-gray-500">
                        {item.item_record?.sku}
                      </span>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.rate.toFixed(2)}</TableCell>
                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
