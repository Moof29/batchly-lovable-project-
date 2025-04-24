
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePortalUserActivity = (organizationId?: string) => {
  return useQuery({
    queryKey: ['portal', 'users', organizationId],
    queryFn: async () => {
      if (!organizationId) return { activeUsers: 0, recentLogins: [] };

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      try {
        const { data: loginEvents, error: loginError } = await supabase
          .from('audit_events')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('event_type', 'portal_login')
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: false });
        
        if (loginError) throw loginError;
        
        const distinctUsers = new Set();
        loginEvents?.forEach(event => {
          if (event.portal_user_id) {
            distinctUsers.add(event.portal_user_id);
          }
        });
        
        return {
          activeUsers: distinctUsers.size,
          recentLogins: loginEvents ? loginEvents.map(event => ({
            userId: event.portal_user_id,
            timestamp: event.created_at,
            ipAddress: event.metadata && typeof event.metadata === 'object' ? (event.metadata as any).ip_address : null,
            userAgent: event.metadata && typeof event.metadata === 'object' ? (event.metadata as any).user_agent : null
          })) : []
        };
      } catch (error) {
        console.error('Error fetching portal user activity:', error);
        return { activeUsers: 0, recentLogins: [] };
      }
    },
    enabled: !!organizationId
  });
};
