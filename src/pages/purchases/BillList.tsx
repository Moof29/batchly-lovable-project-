
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
import { Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";

export const BillList = () => {
  const { data: bills, isLoading } = useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bill_record")
        .select("*, vendor_profile(display_name)")
        .order('bill_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
                    <TableHead className="font-medium">Bill #</TableHead>
                    <TableHead className="font-medium">Vendor</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Due Date</TableHead>
                    <TableHead className="font-medium">Total</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
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
