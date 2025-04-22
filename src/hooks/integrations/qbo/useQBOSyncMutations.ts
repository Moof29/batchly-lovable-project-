import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";
import { qboService } from '@/services/qbo/QBOService';
import { supabase } from '@/integrations/supabase/client';

export const useQBOSyncMutations = (organizationId?: string, user?: any) => {
  const queryClient = useQueryClient();

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
  
  return {
    syncEntitiesMutation,
    processPendingMutation,
    resolveErrorMutation,
    updateEntityConfigMutation
  };
};
