import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { qboService } from '@/services/qbo/QBOService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { useQBOSyncQueries } from './integrations/qbo/useQBOSyncQueries';
import { useQBOSyncMutations } from './integrations/qbo/useQBOSyncMutations';
import { useQBOEntityStatus } from './integrations/qbo/useQBOEntityStatus';

// Hook for QBO Sync operations
export const useQBOSync = (organizationId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Initialize QBO service
  useEffect(() => {
    const initService = async () => {
      if (organizationId) {
        const initialized = await qboService.initialize(organizationId);
        setIsInitialized(initialized);
      }
    };
    
    initService();
  }, [organizationId]);
  
  const {
    connectionQuery,
    entityConfigsQuery,
    pendingOperationsQuery,
    syncHistoryQuery,
    errorRegistryQuery,
    syncMetricsQuery
  } = useQBOSyncQueries(organizationId, isInitialized);

  const {
    syncEntitiesMutation,
    processPendingMutation,
    resolveErrorMutation,
    updateEntityConfigMutation
  } = useQBOSyncMutations(organizationId, user);

  const getEntitySyncStatus = useQBOEntityStatus(organizationId);

  return {
    // Connection status
    isInitialized,
    connection: connectionQuery.data,
    isConnected: !!connectionQuery.data?.is_active,
    isLoadingConnection: connectionQuery.isPending,
    
    // Entity configurations
    entityConfigs: entityConfigsQuery.data || [],
    isLoadingEntityConfigs: entityConfigsQuery.isPending,
    
    // Pending operations
    pendingOperations: pendingOperationsQuery.data || [],
    isLoadingPendingOperations: pendingOperationsQuery.isPending,
    
    // Sync history
    syncHistory: syncHistoryQuery.data || [],
    isLoadingSyncHistory: syncHistoryQuery.isPending,
    
    // Errors
    errors: errorRegistryQuery.data || [],
    isLoadingErrors: errorRegistryQuery.isPending,
    
    // Metrics
    syncMetrics: syncMetricsQuery.data || [],
    isLoadingMetrics: syncMetricsQuery.isPending,
    
    // Actions
    syncEntities: syncEntitiesMutation.mutate,
    isSyncing: syncEntitiesMutation.isPending,
    
    processOperations: processPendingMutation.mutate,
    isProcessing: processPendingMutation.isPending,
    
    resolveError: resolveErrorMutation.mutate,
    isResolvingError: resolveErrorMutation.isPending,
    
    updateEntityConfig: updateEntityConfigMutation.mutate,
    isUpdatingConfig: updateEntityConfigMutation.isPending,
    
    // Helpers
    getEntitySyncStatus
  };
};
