import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { toast } from '@/hooks/use-toast';
import { SyncError, SyncStatus } from '@/types/qbo';
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
  const { oauthMutation, disconnectMutation, refreshTokenMutation } = useQBOConnectionMutations(organizationId);

  const connectionDetails = useQBOConnectionDetails(connectionQuery.data, isDevMode);
  const syncErrors = useQBOErrorsList(errorsQuery.data);

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

  const syncMutation = useMutation({
    mutationFn: async (entityTypes?: string[]) => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }
      
      if (isDevMode) {
        return { success: true };
      }
      
      return { success: true };
    }
  });

  const beginOAuthFlow = useCallback(() => {
    if (isDevMode) {
      localStorage.setItem('batchly-mock-qbo', JSON.stringify({
        enabled: true,
        companyName: 'Acme Test Company',
        companyId: '1234567890'
      }));
      
      connectionQuery.refetch();
      
      toast({
        title: 'Mock QBO Connected',
        description: 'Successfully connected to mock QuickBooks Online account',
      });
    } else {
      oauthMutation.mutate(undefined, {
        onSuccess: (data) => {
          if (data.authUrl) {
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

  const disconnectQBO = useCallback(() => {
    if (window.confirm('Are you sure you want to disconnect from QuickBooks Online? This will stop all data synchronization.')) {
      if (isDevMode) {
        localStorage.removeItem('batchly-mock-qbo');
        
        connectionQuery.refetch();
        
        toast({
          title: 'QBO Disconnected',
          description: 'Successfully disconnected from QuickBooks Online',
          variant: 'destructive'
        });
      } else {
        disconnectMutation.mutate(undefined, {
          onSuccess: () => {
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

  const refreshToken = useCallback(() => {
    if (refreshTokenMutation.isPending) {
      toast({ title: "Token refresh in progress", description: "Please wait…" });
      return;
    }
    refreshTokenMutation.mutate(undefined, {
      onSuccess: (data) => {
        connectionQuery.refetch();
        if (data.success) {
          toast({
            title: "Token refreshed",
            description: data.expires_at
              ? `New expiry: ${new Date(data.expires_at).toLocaleString()}`
              : "QuickBooks token has been refreshed.",
          });
        } else {
          toast({
            title: "Token refresh failed",
            description: "Could not refresh the QuickBooks connection.",
            variant: "destructive"
          });
        }
      },
      onError: (error) => {
        toast({
          title: "Token refresh failed",
          description: error?.message || "Failed to refresh QuickBooks connection.",
          variant: "destructive"
        });
      }
    });
  }, [refreshTokenMutation, connectionQuery]);

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
    tokenExpiresAt: connectionDetails?.expiresAt || null,
    refreshQBOToken: refreshToken,
    isRefreshingToken: refreshTokenMutation.isPending,
    tokenRefUpdatedAt: connectionQuery.data?.qbo_token_expires_at || null,
  };
};
