
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
import { Badge } from "@/components/ui/badge";

export const BillDetail = () => {
  const { id } = useParams();

  const { data: bill, isLoading } = useQuery({
    queryKey: ["bill", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bill_record")
        .select(`
          *,
          vendor_profile:vendor_id(display_name),
          bill_line_item(
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
  if (!bill) return <div>Bill not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bill {bill.bill_number}
        </h1>
        <Badge 
          variant={bill.status === 'paid' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {bill.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bill Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Vendor</dt>
                <dd className="text-sm">{bill.vendor_profile?.display_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Bill Date</dt>
                <dd className="text-sm">
                  {new Date(bill.bill_date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                <dd className="text-sm">
                  {bill.due_date ? new Date(bill.due_date).toLocaleDateString() : '-'}
                </dd>
              </div>
              {bill.memo && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Memo</dt>
                  <dd className="text-sm">{bill.memo}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bill Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="text-lg font-bold">${bill.total.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Balance Due</dt>
                <dd className="text-lg font-bold">${bill.balance_due.toFixed(2)}</dd>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bill.bill_line_item?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.item_record?.name}
                      <br />
                      <span className="text-sm text-gray-500">
                        {item.item_record?.sku}
                      </span>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
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
