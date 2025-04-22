import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { toast } from '@/hooks/use-toast';
import { SyncError, SyncStatus } from '@/components/integrations/QBOSyncStatus';
import { SyncSettings } from '@/components/integrations/QBOSyncSettings';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useQBOConnectionDetails } from "./qbo/useQBOConnectionDetails";
import { useQBOErrorsList } from "./qbo/useQBOErrorsList";
import { useSyncSettingsState } from "./qbo/useSyncSettingsState";
import { useQBOConnectionQuery } from './integrations/qbo/useQBOConnectionQuery';
import { useQBOErrorsQuery } from './integrations/qbo/useQBOErrorsQuery';
import { useQBOConnectionMutations } from './integrations/qbo/useQBOConnectionMutations';

interface ConnectionDetails {
  companyName: string;
  companyId: string;
  connectedAt: Date;
  expiresAt: Date;
}

export const useQBOIntegration = () => {
  const { user } = useAuth();
  const { isDevMode } = useDevMode();
  const organizationId = user?.organization_id || (isDevMode ? "00000000-0000-0000-0000-000000000000" : undefined);

  const connectionQuery = useQBOConnectionQuery();
  const errorsQuery = useQBOErrorsQuery(organizationId, !!organizationId && (connectionQuery.data?.is_active || isDevMode));
  const { oauthMutation, disconnectMutation } = useQBOConnectionMutations(organizationId);

  const connectionDetails = useQBOConnectionDetails(connectionQuery.data, isDevMode);
  const syncErrors = useQBOErrorsList(errorsQuery.data);

  // Default sync settings and updateSyncSettings
  const { syncSettings, updateSyncSettings } = useSyncSettingsState({
    entities: {
      customers: true,
      items: true,
      invoices: true,
      payments: true,
      bills: true
    },
    frequency: 'daily',
    scheduleTime: '02:00',
    autoSyncNewRecords: true,
    conflictResolutionStrategy: 'newest_wins'
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async (entityTypes?: string[]) => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }
      
      // In dev mode, just simulate success
      if (isDevMode) {
        return { success: true };
      }
      
      // In a real implementation, you would:
      // 1. Queue sync operations for the specified entity types
      // 2. Or start a full sync if no entity types are specified
      
      // For now, we'll just return success
      return { success: true };
    }
  });

  // Function to begin OAuth flow
  const beginOAuthFlow = useCallback(() => {
    if (isDevMode) {
      // In dev mode, simulate connection
      localStorage.setItem('batchly-mock-qbo', JSON.stringify({
        enabled: true,
        companyName: 'Acme Test Company',
        companyId: '1234567890'
      }));
      
      // Refresh connection data
      connectionQuery.refetch();
      
      toast({
        title: 'Mock QBO Connected',
        description: 'Successfully connected to mock QuickBooks Online account',
      });
    } else {
      // In production, initiate real OAuth flow
      oauthMutation.mutate(undefined, {
        onSuccess: (data) => {
          if (data.authUrl) {
            // Redirect to QBO authorization page
            window.location.href = data.authUrl;
          } else {
            toast({
              title: 'QBO Connection Failed',
              description: 'Failed to initialize OAuth flow',
              variant: 'destructive'
            });
          }
        },
        onError: (error) => {
          toast({
            title: 'QBO Connection Failed',
            description: error.message || 'An error occurred',
            variant: 'destructive'
          });
        }
      });
    }
  }, [isDevMode, connectionQuery, oauthMutation, organizationId]);

  // Function to disconnect QBO
  const disconnectQBO = useCallback(() => {
    if (window.confirm('Are you sure you want to disconnect from QuickBooks Online? This will stop all data synchronization.')) {
      if (isDevMode) {
        // In dev mode, just clear local storage
        localStorage.removeItem('batchly-mock-qbo');
        
        // Refresh connection data
        connectionQuery.refetch();
        
        toast({
          title: 'QBO Disconnected',
          description: 'Successfully disconnected from QuickBooks Online',
          variant: 'destructive'
        });
      } else {
        // In production, call disconnect mutation
        disconnectMutation.mutate(undefined, {
          onSuccess: () => {
            // Refresh connection data
            connectionQuery.refetch();
            
            toast({
              title: 'QBO Disconnected',
              description: 'Successfully disconnected from QuickBooks Online',
              variant: 'destructive'
            });
          },
          onError: (error) => {
            toast({
              title: 'QBO Disconnect Failed',
              description: error.message || 'An error occurred',
              variant: 'destructive'
            });
          }
        });
      }
    }
  }, [isDevMode, connectionQuery, disconnectMutation, organizationId]);

  // Function to trigger sync
  const triggerSync = useCallback((entityTypes?: string[]) => {
    if (syncMutation.isPending) {
      toast({
        title: 'Sync in progress',
        description: 'Please wait for the current sync to complete',
        variant: 'default'
      });
      return;
    }
    
    const entitiesMessage = entityTypes && entityTypes.length > 0 
      ? `Syncing ${entityTypes.join(', ')}` 
      : 'Syncing all entities';
    
    syncMutation.mutate(entityTypes, {
      onSuccess: () => {
        toast({
          title: 'Sync Started',
          description: entitiesMessage,
        });
      },
      onError: (error) => {
        toast({
          title: 'Sync Failed',
          description: error.message || 'An error occurred',
          variant: 'destructive'
        });
      }
    });
  }, [syncMutation, organizationId]);

  return {
    isConnected: (isDevMode && connectionQuery.data?.enabled) || 
                 (!isDevMode && !!connectionQuery.data?.is_active),
    connectionDetails,
    lastSync: connectionQuery.data?.last_sync_at 
      ? new Date(connectionQuery.data.last_sync_at) 
      : null,
    syncErrors,
    syncSettings,
    syncInProgress: syncMutation.isPending,
    beginOAuthFlow,
    disconnectQBO,
    updateSyncSettings,
    triggerSync,
  };
};
