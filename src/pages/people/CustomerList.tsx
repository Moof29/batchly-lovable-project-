import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomersTable } from "@/components/people/CustomersTable";
import { useCustomerPortalAccess } from "@/hooks/people/useCustomerPortalAccess";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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
            const hasAccess = await import("@/services/people/CustomerPortalAccessService").then(mod =>
              mod.CustomerPortalAccessService.hasPortalAccess(customer.id)
            );
            map[customer.id] = hasAccess;
          } catch {
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
      const svc = (await import("@/services/people/CustomerPortalAccessService")).CustomerPortalAccessService;
      if (enabled) {
        await svc.grantPortalAccess(customerId);
      } else {
        await svc.revokePortalAccess(customerId);
      }
      setPortalAccessMap((prev) => ({ ...prev, [customerId]: enabled }));
    } catch (err) {
      console.error("Portal access change failed", err);
    } finally {
      setLoadingCustomerId(null);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
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
