
import { supabase } from "@/integrations/supabase/client";

export const CustomerPortalAccessService = {
  // Checks if this customer has portal access by finding any portal user link
  async hasPortalAccess(customerId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("customer_portal_user_links")
      .select("id")
      .eq("customer_id", customerId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  },
  // Enable access: create a link (for demo, assign a dummy user; real deployment should use invite flow)
  async grantPortalAccess(customerId: string): Promise<void> {
    // Here you would implement choosing a user to assign; for demo, assign a dummy portal_user_id
    // (You might want to create a UI to invite/set, for now assign customerId as portal_user_id for testing)
    const portal_user_id = customerId; // NOT REAL LOGIC! Only for simple PoC
    const { error } = await supabase
      .from("customer_portal_user_links")
      .insert([{ portal_user_id, customer_id: customerId }]);
    if (error) throw error;
  },
  // Remove any portal access links for this customer
  async revokePortalAccess(customerId: string): Promise<void> {
    const { error } = await supabase
      .from("customer_portal_user_links")
      .delete()
      .eq("customer_id", customerId);
    if (error) throw error;
  }
};
