
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePortalPaymentActivity = (organizationId?: string) => {
  return useQuery({
    queryKey: ['portal', 'payments', organizationId],
    queryFn: async () => {
      if (!organizationId) return { 
        total: 0, 
        totalAmount: 0,
        recentPayments: [] 
      };

      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: payments, error } = await supabase
          .from('payment_receipt')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('payment_gateway', 'portal')
          .gte('payment_date', thirtyDaysAgo.toISOString());
          
        if (error) throw error;
        
        const totalAmount = payments?.reduce((sum, payment) => sum + (payment.total_amount || 0), 0) || 0;
        
        const byDate = payments?.reduce((acc, payment) => {
          const dateKey = payment.payment_date;
          if (!acc[dateKey]) acc[dateKey] = { date: dateKey, amount: 0, count: 0 };
          acc[dateKey].amount += (payment.total_amount || 0);
          acc[dateKey].count += 1;
          return acc;
        }, {}) || {};
        
        const recentPayments = Object.values(byDate).sort((a: any, b: any) => 
          a.date.localeCompare(b.date)
        );
        
        return {
          total: payments?.length || 0,
          totalAmount,
          recentPayments
        };
      } catch (error) {
        console.error('Error fetching portal payment activity:', error);
        return { 
          total: 0, 
          totalAmount: 0,
          recentPayments: [] 
        };
      }
    },
    enabled: !!organizationId
  });
};
