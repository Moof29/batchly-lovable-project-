import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { qboService } from '@/services/qbo/QBOService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

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
  
  // Fetch QBO connection status
  const connectionQuery = useQuery({
    queryKey: ['qbo', 'connection', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      return await qboService.getConnection();
    },
    enabled: !!organizationId
  });
  
  // Fetch entity configurations
  const entityConfigsQuery = useQuery({
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
  });
  
  // Fetch pending operations
  const pendingOperationsQuery = useQuery({
    queryKey: ['qbo', 'pendingOperations', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      return await qboService.getPendingOperations();
    },
    enabled: !!organizationId && isInitialized,
    refetchInterval: 30000 // Refetch every 30 seconds
  });
  
  // Fetch sync history
  const syncHistoryQuery = useQuery({
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
  });
  
  // Fetch error registry
  const errorRegistryQuery = useQuery({
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
  });
  
  // Mutation to start a sync for specific entities
  const syncEntitiesMutation = useMutation({
    mutationFn: async ({ 
      entityType, 
      entityIds, 
      direction = 'to_qbo'
    }: { 
      entityType: string; 
      entityIds: string[];
      direction?: 'to_qbo' | 'from_qbo';
    }) => {
      if (!organizationId || !entityType || !entityIds?.length) {
        throw new Error("Missing required parameters for sync");
      }
      
      // Start sync batch
      const batchId = await qboService.startSyncBatch(entityType, entityIds, direction);
      
      // Create sync history record
      const { error } = await supabase
        .from('qbo_sync_history')
        .insert({
          organization_id: organizationId,
          sync_type: 'manual',
          entity_types: [entityType],
          started_by: user?.id,
          status: 'started',
          entity_count: entityIds.length,
          started_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Update entity status to syncing
      for (const entityId of entityIds) {
        await qboService.updateEntitySyncStatus(entityType, entityId, 'syncing');
      }
      
      return batchId;
    },
    onSuccess: () => {
      toast({
        title: "Sync started",
        description: "The selected entities were queued for synchronization with QuickBooks Online.",
      });
      
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['qbo', 'pendingOperations'] });
      queryClient.invalidateQueries({ queryKey: ['qbo', 'syncHistory'] });
    },
    onError: (error) => {
      toast({
        title: "Sync failed",
        description: `Failed to start sync: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Mutation to process pending operations
  const processPendingMutation = useMutation({
    mutationFn: async () => {
      const pendingOps = await qboService.getPendingOperations();
      let processed = 0;
      
      if (!pendingOps.length) {
        return { processed: 0, success: 0, failed: 0 };
      }
      
      let success = 0;
      let failed = 0;
      
      // Process each operation
      for (const op of pendingOps.slice(0, 10)) { // Process max 10 at a time
        try {
          const result = await qboService.processSyncOperation(op);
          processed++;
          if (result) {
            success++;
          } else {
            failed++;
          }
        } catch (error) {
          console.error(`Error processing operation ${op.id}:`, error);
          failed++;
        }
      }
      
      return { processed, success, failed };
    },
    onSuccess: (result) => {
      if (result.processed > 0) {
        toast({
          title: "Sync progress",
          description: `Processed ${result.processed} operations: ${result.success} succeeded, ${result.failed} failed.`
        });
        
        // Refresh queries
        queryClient.invalidateQueries({ queryKey: ['qbo', 'pendingOperations'] });
        queryClient.invalidateQueries({ queryKey: ['qbo', 'syncHistory'] });
        queryClient.invalidateQueries({ queryKey: ['qbo', 'errorRegistry'] });
      }
    },
    onError: (error) => {
      toast({
        title: "Processing failed",
        description: `Failed to process operations: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Mutation to resolve an error
  const resolveErrorMutation = useMutation({
    mutationFn: async (errorId: string) => {
      if (!organizationId) throw new Error("Missing organization ID");
      
      const { error } = await supabase
        .from('qbo_error_registry')
        .update({ is_resolved: true })
        .eq('id', errorId)
        .eq('organization_id', organizationId);
        
      if (error) throw error;
      return errorId;
    },
    onSuccess: () => {
      toast({
        title: "Error resolved",
        description: "The error has been marked as resolved."
      });
      
      // Refresh error registry
      queryClient.invalidateQueries({ queryKey: ['qbo', 'errorRegistry'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to resolve error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Mutation to update entity configuration
  const updateEntityConfigMutation = useMutation({
    mutationFn: async ({ 
      configId, 
      updates 
    }: { 
      configId: string;
      updates: Partial<{
        is_enabled: boolean;
        sync_direction: 'to_qbo' | 'from_qbo' | 'bidirectional';
        sync_frequency_minutes: number;
        priority_level: number;
        batch_size: number;
      }>;
    }) => {
      if (!organizationId) throw new Error("Missing organization ID");
      
      const { error } = await supabase
        .from('qbo_entity_config')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', configId)
        .eq('organization_id', organizationId);
        
      if (error) throw error;
      return configId;
    },
    onSuccess: () => {
      toast({
        title: "Configuration updated",
        description: "The entity configuration has been updated successfully."
      });
      
      // Refresh entity configs
      queryClient.invalidateQueries({ queryKey: ['qbo', 'entityConfigs'] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: `Failed to update configuration: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Helper function to get entity status counts
  const getEntitySyncStatus = useCallback(async (entityType: string) => {
    if (!organizationId) return { pending: 0, syncing: 0, synced: 0, error: 0, total: 0 };
    
    // Map entity type to table name
    const tableMap: Record<string, string> = {
      'customer_profile': 'customer_profile',
      'vendor_profile': 'vendor_profile',
      'item_record': 'item_record',
      'invoice_record': 'invoice_record',
      'bill_record': 'bill_record',
      'payment_receipt': 'payment_receipt'
    };
    
    const tableName = tableMap[entityType];
    if (!tableName) return { pending: 0, syncing: 0, synced: 0, error: 0, total: 0 };
    
    try {
      // Need to manually count since the group function isn't available
      const statuses = ['pending', 'syncing', 'synced', 'error'];
      const counts = {
        pending: 0,
        syncing: 0,
        synced: 0,
        error: 0,
        total: 0
      };
      
      // Get total count
      const { count: totalCount } = await supabase
        .from(tableName as any) // Type cast to work around the typing issue
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId);
      
      counts.total = totalCount || 0;
      
      // Get individual status counts
      for (const status of statuses) {
        const { count } = await supabase
          .from(tableName as any) // Type cast to work around the typing issue
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organizationId)
          .eq('qbo_sync_status', status);
        
        counts[status as keyof typeof counts] = count || 0;
      }
      
      return counts;
    } catch (error) {
      console.error(`Error fetching sync status counts for ${entityType}:`, error);
      return { pending: 0, syncing: 0, synced: 0, error: 0, total: 0 };
    }
  }, [organizationId]);
  
  // Sync metrics query
  const syncMetricsQuery = useQuery({
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
  });
  
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
