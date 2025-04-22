
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CustomerPortalAccessService } from "@/services/people/CustomerPortalAccessService";

export type PortalUser = {
  id: string;
  email: string;
  invited_at: string | null;
  accepted_at: string | null;
  customer_id: string | null;
  is_active: boolean;
  invite_token: string | null;
  created_at: string;
  customer: {
    id: string;
    display_name: string;
  } | null;
};

export function usePortalUsers(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["portal_users", { page }],
    queryFn: async () => {
      // In development with mock mode enabled, use local data
      if (CustomerPortalAccessService.DEV_MOCK_CUSTOMER_PORTAL_ACCESS) {
        // Get customers with portal access from mock storage
        const customersWithAccess = await CustomerPortalAccessService.getAllCustomersWithAccess();
        
        // For each customer with access, create a portal user entry
        const mockPortalUsers: PortalUser[] = await Promise.all(
          customersWithAccess.map(async (customerId) => {
            // Get customer details
            const { data: customer } = await supabase
              .from("customer_profile")
              .select("id, display_name, email")
              .eq("id", customerId)
              .single();
            
            return {
              id: customerId, // Using customer ID as portal user ID in mock mode
              email: customer?.email || "customer@example.com",
              invited_at: new Date().toISOString(),
              accepted_at: new Date().toISOString(),
              customer_id: customerId,
              is_active: true,
              invite_token: null,
              created_at: new Date().toISOString(),
              customer: customer ? {
                id: customer.id,
                display_name: customer.display_name
              } : null
            };
          })
        );
        
        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        return mockPortalUsers.slice(from, to);
      }
      
      // Normal database query when not in mock mode
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error } = await supabase
        .from("customer_portal_user_links")
        .select(`
          id,
          portal_user_id,
          customer_id,
          customer:customer_id(id, display_name),
          created_at
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const enrichedUsers: PortalUser[] = await Promise.all((data || []).map(async (link) => {
        const { data: userData } = await supabase
          .from("users")
          .select(`
            id,
            email,
            created_at,
            last_login_at
          `)
          .eq('id', link.portal_user_id)
          .single();

        return {
          id: link.portal_user_id,
          email: userData?.email || "Unknown",
          invited_at: null,
          accepted_at: null,
          customer_id: link.customer_id,
          is_active: true,
          invite_token: null,
          created_at: userData?.created_at || link.created_at,
          customer: link.customer,
        };
      }));

      return enrichedUsers;
    },
    // Refetch when customers with portal access change
    refetchOnWindowFocus: true,
  });
}
