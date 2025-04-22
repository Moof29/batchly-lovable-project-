import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { toast } from '@/hooks/use-toast';
import { SyncError, SyncStatus } from '@/components/integrations/QBOSyncStatus';
import { SyncSettings } from '@/components/integrations/QBOSyncSettings';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation } from '@tanstack/react-query';

interface ConnectionDetails {
  companyName: string;
  companyId: string;
  connectedAt: Date;
  expiresAt: Date;
}

export const useQBOIntegration = () => {
  const { user } = useAuth();
  const { isDevMode } = useDevMode();
  
  // State for QBO integration
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);
  const [syncErrors, setSyncErrors] = useState<SyncError[]>([]);
  
  // Default sync settings
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
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

  // Get organization ID
  const organizationId = user?.organization_id || (isDevMode ? "00000000-0000-0000-0000-000000000000" : undefined);

  // Query to fetch QBO connection status
  const connectionQuery = useQuery({
    queryKey: ['qbo', 'connection', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;

      if (isDevMode) {
        // In dev mode, check for mock configuration
        const mockConfig = localStorage.getItem('batchly-mock-qbo');
        if (mockConfig) {
          try {
            return JSON.parse(mockConfig);
          } catch (e) {
            console.error('Error parsing mock QBO config', e);
          }
        }
        return null;
      }
      
      // In production, fetch real connection data
      const { data, error } = await supabase
        .from('qbo_connection')
        .select('*')
        .eq('organization_id', organizationId)
        .single();
        
      if (error) {
        console.error("Error fetching QBO connection:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!organizationId,
    refetchInterval: 300000 // Refetch every 5 minutes
  });

  // Sync errors query
  const errorsQuery = useQuery({
    queryKey: ['qbo', 'errors', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      
      if (isDevMode) {
        return [
          {
            id: 'err-1',
            entityType: 'invoices' as 'invoices',
            message: 'Invoice #INV-2023-0547 failed: Invalid customer reference',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            resolved: false
          },
          {
            id: 'err-2',
            entityType: 'items' as 'items',
            message: 'Item SKU-7744 failed to sync: Duplicate SKU in QuickBooks',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            resolved: false
          }
        ] as SyncError[];
      }
      
      const { data, error } = await supabase
        .from('qbo_error_registry')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_resolved', false)
        .order('last_occurred_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error("Error fetching QBO errors:", error);
        return [];
      }
      
      return data.map(err => {
        let entityType: 'customers' | 'items' | 'invoices' | 'payments' | 'bills' | string = 'items';
        if (err.error_category === 'data') {
          entityType = 'items';
        } else if (err.error_category === 'validation') {
          entityType = 'customers';
        } else if (err.error_category === 'auth') {
          entityType = 'invoices';
        } else {
          entityType = 'bills';
        }
        
        return {
          id: err.id,
          entityType,
          message: err.error_message,
          timestamp: new Date(err.last_occurred_at),
          resolved: err.is_resolved
        };
      });
    },
    enabled: !!organizationId && (connectionQuery.data?.is_active || isDevMode),
    refetchInterval: 30000 // Refetch every 30 seconds
  });
  
  // Update connection details when the query data changes
  useEffect(() => {
    if (connectionQuery.data) {
      if (isDevMode && typeof connectionQuery.data === 'object' && connectionQuery.data.enabled) {
        // Format mock connection data
        setConnectionDetails({
          companyName: connectionQuery.data.companyName || 'Mock Company',
          companyId: connectionQuery.data.companyId || '123456789',
          connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });
      } else if (!isDevMode && connectionQuery.data.is_active) {
        // Format real connection data
        setConnectionDetails({
          companyName: connectionQuery.data.qbo_company_id || 'QBO Company',
          companyId: connectionQuery.data.qbo_realm_id,
          connectedAt: new Date(connectionQuery.data.last_connected_at),
          expiresAt: new Date(connectionQuery.data.qbo_token_expires_at),
        });
      } else {
        setConnectionDetails(null);
      }
    } else {
      setConnectionDetails(null);
    }
  }, [connectionQuery.data, isDevMode]);
  
  // Update sync errors when the query data changes
  useEffect(() => {
    if (errorsQuery.data) {
      setSyncErrors(errorsQuery.data);
    } else {
      setSyncErrors([]);
    }
  }, [errorsQuery.data]);

  // OAuth flow mutation
  const oauthMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }
      
      // In dev mode, just simulate success
      if (isDevMode) {
        return { success: true, authUrl: '#' };
      }
      
      // In production, call the OAuth function
      const { data, error } = await supabase.functions.invoke('qbo-oauth', {
        body: {
          organizationId,
          environment: 'production',
          redirectUri: `${window.location.origin}/settings/integrations`
        },
        method: 'POST'
      });
      
      if (error) throw error;
      return data;
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

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }
      
      // In dev mode, just simulate success
      if (isDevMode) {
        return { success: true };
      }
      
      // In production, call the OAuth function with disconnect action
      const { data, error } = await supabase.functions.invoke('qbo-oauth', {
        body: {
          organizationId,
          action: 'disconnect'
        },
        method: 'POST'
      });
      
      if (error) throw error;
      return data;
    }
  });

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

  // Function to update sync settings
  const updateSyncSettings = useCallback((newSettings: SyncSettings) => {
    setSyncSettings(newSettings);
    
    // In a real implementation, you'd save these settings to the database
    toast({
      title: 'Sync Settings Updated',
      description: 'Your QuickBooks sync settings have been saved',
    });
  }, []);
  
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
