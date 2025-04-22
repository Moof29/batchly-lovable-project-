
import { supabase } from "@/integrations/supabase/client";

// Toggle this to true to enable mock mode for portal access in development.
export const DEV_MOCK_CUSTOMER_PORTAL_ACCESS = true;

// In-memory mock storage for testing toggles per-customer.
const mockPortalAccess: Record<string, boolean> = {};

export const CustomerPortalAccessService = {
  DEV_MOCK_CUSTOMER_PORTAL_ACCESS,

  async hasPortalAccess(customerId: string): Promise<boolean> {
    if (DEV_MOCK_CUSTOMER_PORTAL_ACCESS) {
      // If no value is set, default to false
      return !!mockPortalAccess[customerId];
    }
    try {
      const { data, error } = await supabase
        .from("customer_portal_user_links")
        .select("id")
        .eq("customer_id", customerId)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking portal access:", error);
      return false;
    }
  },

  async grantPortalAccess(customerId: string): Promise<void> {
    if (DEV_MOCK_CUSTOMER_PORTAL_ACCESS) {
      mockPortalAccess[customerId] = true;
      return;
    }
    try {
      const portal_user_id = customerId;
      const { error } = await supabase
        .from("customer_portal_user_links")
        .insert([{ portal_user_id, customer_id: customerId }]);
      if (error) throw error;
    } catch (error) {
      console.error("Error granting portal access:", error);
      throw error;
    }
  },

  async revokePortalAccess(customerId: string): Promise<void> {
    if (DEV_MOCK_CUSTOMER_PORTAL_ACCESS) {
      mockPortalAccess[customerId] = false;
      return;
    }
    try {
      const { error } = await supabase
        .from("customer_portal_user_links")
        .delete()
        .eq("customer_id", customerId);
      if (error) throw error;
    } catch (error) {
      console.error("Error revoking portal access:", error);
      throw error;
    }
  },

  // New method to get all customers with portal access
  async getAllCustomersWithAccess(): Promise<string[]> {
    if (DEV_MOCK_CUSTOMER_PORTAL_ACCESS) {
      return Object.entries(mockPortalAccess)
        .filter(([_, hasAccess]) => hasAccess)
        .map(([customerId, _]) => customerId);
    }
    
    try {
      const { data, error } = await supabase
        .from("customer_portal_user_links")
        .select("customer_id");
      
      if (error) throw error;
      return (data || []).map(item => item.customer_id);
    } catch (error) {
      console.error("Error getting all customers with access:", error);
      return [];
    }
  }
};
