
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePortalMessageActivity = (organizationId?: string) => {
  return useQuery({
    queryKey: ['portal', 'messages', organizationId],
    queryFn: async () => {
      if (!organizationId) return { 
        total: 0, 
        unresolved: 0, 
        recent: [],
        byCustomer: {}
      };

      try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        
        const { data: messages, error: msgsError } = await supabase
          .from('customer_messages')
          .select('*')
          .eq('organization_id', organizationId);
        
        if (msgsError) throw msgsError;
        
        const { data: recentMessages, error: recentError } = await supabase
          .from('customer_messages')
          .select('*')
          .eq('organization_id', organizationId)
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: false });
          
        if (recentError) throw recentError;
        
        const unresolved = messages?.filter(msg => msg.status === 'unread').length || 0;
        
        const byCustomer = messages?.reduce((acc, msg) => {
          const customerId = msg.customer_id;
          if (!acc[customerId]) acc[customerId] = { total: 0, unread: 0 };
          acc[customerId].total++;
          if (msg.status === 'unread') acc[customerId].unread++;
          return acc;
        }, {}) || {};
        
        return {
          total: messages?.length || 0,
          unresolved,
          recent: recentMessages ? recentMessages.map(msg => ({
            id: msg.id,
            customerId: msg.customer_id,
            subject: msg.subject,
            status: msg.status,
            timestamp: msg.created_at
          })) : [],
          byCustomer
        };
      } catch (error) {
        console.error('Error fetching portal message activity:', error);
        return { 
          total: 0, 
          unresolved: 0, 
          recent: [],
          byCustomer: {}
        };
      }
    },
    enabled: !!organizationId
  });
};
