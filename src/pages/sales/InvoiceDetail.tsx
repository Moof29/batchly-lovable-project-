
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const InvoiceDetail = () => {
  const { id } = useParams();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_record")
        .select(`
          *,
          customer_profile:customer_id(display_name),
          invoice_line_item(
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
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Invoice {invoice.invoice_number}
        </h1>
        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className="capitalize">
          {invoice.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer</dt>
                <dd className="text-sm">{invoice.customer_profile?.display_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Invoice Date</dt>
                <dd className="text-sm">
                  {new Date(invoice.invoice_date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                <dd className="text-sm">
                  {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                </dd>
              </div>
              {invoice.po_number && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">PO Number</dt>
                  <dd className="text-sm">{invoice.po_number}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                <dd className="text-sm">${invoice.subtotal?.toFixed(2)}</dd>
              </div>
              {invoice.discount_total > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Discount</dt>
                  <dd className="text-sm">-${invoice.discount_total.toFixed(2)}</dd>
                </div>
              )}
              {invoice.shipping_total > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                  <dd className="text-sm">${invoice.shipping_total.toFixed(2)}</dd>
                </div>
              )}
              {invoice.tax_total > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tax</dt>
                  <dd className="text-sm">${invoice.tax_total.toFixed(2)}</dd>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4">
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="text-lg font-bold">${invoice.total.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Balance Due</dt>
                <dd className="text-sm font-semibold text-red-600">
                  ${invoice.balance_due.toFixed(2)}
                </dd>
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
                {invoice.invoice_line_item?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.item_record?.name}
                      {item.item_record?.sku && (
                        <span className="text-sm text-gray-500">
                          <br />
                          SKU: {item.item_record.sku}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell>${item.amount?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {(invoice.terms || invoice.message || invoice.memo) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                {invoice.terms && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Terms</dt>
                    <dd className="text-sm">{invoice.terms}</dd>
                  </div>
                )}
                {invoice.message && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Message</dt>
                    <dd className="text-sm">{invoice.message}</dd>
                  </div>
                )}
                {invoice.memo && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Memo</dt>
                    <dd className="text-sm">{invoice.memo}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
