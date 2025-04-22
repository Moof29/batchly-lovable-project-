
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomersTable } from "@/components/people/CustomersTable";
import { useQueryClient } from "@tanstack/react-query";
import { CustomerPortalAccessService } from "@/services/people/CustomerPortalAccessService";
import { toast } from "sonner";

export const CustomerList = () => {
  const [sorting, setSorting] = useState({ column: "display_name", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [portalAccessMap, setPortalAccessMap] = useState<Record<string, boolean>>({});
  const [loadingCustomerId, setLoadingCustomerId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: customers, isLoading } = useCustomers(sorting, filters);

  useEffect(() => {
    let mounted = true;
    async function loadPortalAccess() {
      if (!customers) return;
      
      const map: Record<string, boolean> = {};
      await Promise.all(
        customers.map(async (customer) => {
          try {
            const hasAccess = await CustomerPortalAccessService.hasPortalAccess(customer.id);
            map[customer.id] = hasAccess;
          } catch (error) {
            console.error(`Error loading portal access for ${customer.id}:`, error);
            map[customer.id] = false;
          }
        })
      );
      
      if (mounted) setPortalAccessMap(map);
    }
    
    loadPortalAccess();
    return () => {
      mounted = false;
    };
  }, [customers]);

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

  const handleTogglePortalAccess = async (customerId: string, enabled: boolean) => {
    setLoadingCustomerId(customerId);
    try {
      if (enabled) {
        await CustomerPortalAccessService.grantPortalAccess(customerId);
        toast.success("Portal access granted successfully");
      } else {
        await CustomerPortalAccessService.revokePortalAccess(customerId);
        toast.success("Portal access revoked successfully");
      }
      setPortalAccessMap((prev) => ({ ...prev, [customerId]: enabled }));
      
      // Invalidate both queries to ensure they are in sync
      queryClient.invalidateQueries({ queryKey: ["portalAccess", customerId] });
      queryClient.invalidateQueries({ queryKey: ["portal_users"] });
    } catch (err) {
      console.error("Portal access change failed", err);
      toast.error(`Failed to ${enabled ? 'grant' : 'revoke'} portal access`);
    } finally {
      setLoadingCustomerId(null);
    }
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

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading customers...</div>
            </div>
          ) : (
            <CustomersTable
              customers={customers || []}
              sorting={sorting}
              filters={filters}
              onSort={handleSort}
              onFilter={handleFilter}
              portalAccessMap={portalAccessMap}
              onTogglePortalAccess={handleTogglePortalAccess}
              loadingCustomerId={loadingCustomerId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
