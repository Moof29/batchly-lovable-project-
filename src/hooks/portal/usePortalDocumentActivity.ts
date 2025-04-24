
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePortalDocumentActivity = (organizationId?: string) => {
  return useQuery({
    queryKey: ['portal', 'documents', organizationId],
    queryFn: async () => {
      if (!organizationId) return { total: 0, downloads: 0, recent: [] };

      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: docEvents, error } = await supabase
          .from('audit_events')
          .select('*')
          .eq('organization_id', organizationId)
          .in('event_type', ['document_view', 'document_download'])
          .gte('created_at', thirtyDaysAgo.toISOString());
          
        if (error) throw error;
        
        const views = docEvents?.filter(e => e.event_type === 'document_view').length || 0;
        const downloads = docEvents?.filter(e => e.event_type === 'document_download').length || 0;
        
        return {
          total: views,
          downloads,
          recent: docEvents ? docEvents.map(event => ({
            id: event.id,
            eventType: event.event_type,
            entityId: event.entity_id,
            userId: event.portal_user_id,
            timestamp: event.created_at,
            documentName: event.metadata && typeof event.metadata === 'object' ? (event.metadata as any).document_name : null
          })) : []
        };
      } catch (error) {
        console.error('Error fetching portal document activity:', error);
        return { total: 0, downloads: 0, recent: [] };
      }
    },
    enabled: !!organizationId
  });
};
