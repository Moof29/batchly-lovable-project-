import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { qboService } from '@/services/qbo/QBOService';

export const useQBOSyncQueries = (organizationId?: string, isInitialized?: boolean) => {
  return {
    connectionQuery: useQuery({
      queryKey: ['qbo', 'connection', organizationId],
      queryFn: async () => {
        if (!organizationId) return null;
        return await qboService.getConnection();
      },
      enabled: !!organizationId
    }),
    entityConfigsQuery: useQuery({
      queryKey: ['qbo', 'entityConfigs', organizationId],
      queryFn: async () => {
        if (!organizationId) return [];
        const { data, error } = await supabase
          .from('qbo_entity_config')
          .select('*')
          .eq('organization_id', organizationId);
        
        if (error) throw error;
        return data;
      },
      enabled: !!organizationId
    }),
    pendingOperationsQuery: useQuery({
      queryKey: ['qbo', 'pendingOperations', organizationId],
      queryFn: async () => {
        if (!organizationId) return [];
        return await qboService.getPendingOperations();
      },
      enabled: !!organizationId && isInitialized,
      refetchInterval: 30000 // Refetch every 30 seconds
    }),
    syncHistoryQuery: useQuery({
      queryKey: ['qbo', 'syncHistory', organizationId],
      queryFn: async () => {
        if (!organizationId) return [];
        const { data, error } = await supabase
          .from('qbo_sync_history')
          .select('*')
          .eq('organization_id', organizationId)
          .order('started_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        return data;
      },
      enabled: !!organizationId
    }),
    errorRegistryQuery: useQuery({
      queryKey: ['qbo', 'errorRegistry', organizationId],
      queryFn: async () => {
        if (!organizationId) return [];
        const { data, error } = await supabase
          .from('qbo_error_registry')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('is_resolved', false)
          .order('last_occurred_at', { ascending: false });
        
        if (error) throw error;
        return data;
      },
      enabled: !!organizationId
    }),
    syncMetricsQuery: useQuery({
      queryKey: ['qbo', 'syncMetrics', organizationId],
      queryFn: async () => {
        if (!organizationId) return [];
        const { data, error } = await supabase
          .from('qbo_sync_metrics')
          .select('*')
          .eq('organization_id', organizationId)
          .order('recorded_at', { ascending: false })
          .limit(30);
        
        if (error) throw error;
        return data;
      },
      enabled: !!organizationId
    }),
  };
};
