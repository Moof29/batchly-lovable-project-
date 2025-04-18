
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
import { Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PermissionGate } from "@/components/PermissionGate";
import { useDevMode } from "@/contexts/DevModeContext";

export const CustomerList = () => {
  const { isDevMode } = useDevMode();

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ["customers", isDevMode],
    queryFn: async () => {
      console.log("Fetching customers, dev mode:", isDevMode);
      
      // In dev mode, return mock customer data
      if (isDevMode) {
        console.log("Returning mock customer data");
        return [
          { 
            id: 'mock-id-1', 
            display_name: 'Acme Corporation', 
            email: 'contact@acmecorp.com', 
            phone: '(555) 123-4567',
            balance: 1200.00
          },
          { 
            id: 'mock-id-2', 
            display_name: 'TechStart Inc', 
            email: 'info@techstart.com', 
            phone: '(555) 987-6543',
            balance: 450.75
          },
          { 
            id: 'mock-id-3', 
            display_name: 'Global Widgets', 
            email: 'sales@globalwidgets.com', 
            phone: '(555) 456-7890',
            balance: 0.00
          }
        ];
      }

      console.log("Fetching from Supabase");
      try {
        const { data, error } = await supabase
          .from("customer_profile")
          .select("*")
          .eq('is_active', true)
          .order('display_name', { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log(`Got ${data?.length || 0} customers from Supabase`);
        return data || [];
      } catch (e) {
        console.error("Error fetching customers:", e);
        throw e;
      }
    },
    retry: 1,
  });

  if (error) {
    console.error("Query error:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <PermissionGate
          resource="customers"
          action="create"
          fallback={
            <Button variant="outline" disabled>
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          }
        >
          <Button asChild>
            <Link to="/people/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Link>
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500 mr-2" />
              <span>Loading customers...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading customers. Please try again.
            </div>
          ) : customers && customers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
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
          ) : (
            <div className="p-8 text-center text-gray-500">
              No customers found. {isDevMode && "This might be a permissions issue."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
