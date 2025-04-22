
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePortalInvoices = (customerId?: string) => {
  return useQuery({
    queryKey: ["portalInvoices", customerId],
    queryFn: async () => {
      if (!customerId) return { invoices: [] };
      
      const { data, error } = await supabase
        .from("invoice_record")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return { invoices: data || [] };
    },
    enabled: !!customerId
  });
};
